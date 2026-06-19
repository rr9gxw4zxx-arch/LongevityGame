#pragma once

#include "CoreMinimal.h"
#include "Components/ActorComponent.h"
#include "Data/LongevityDataTypes.h"
#include "BattleComponent.generated.h"

DECLARE_DYNAMIC_MULTICAST_DELEGATE_ThreeParams(FOnDamageDealt, AActor*, Target, float, Damage, FName, SkillId);
DECLARE_DYNAMIC_MULTICAST_DELEGATE_TwoParams(FOnDamageTaken, float, Damage, AActor*, Instigator);
DECLARE_DYNAMIC_MULTICAST_DELEGATE(FOnDeath);
DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnHealthChanged, float, HealthPercent);

/**
 * Combat component shared by Player and Enemy.
 * Maps from: BattleSystem.js (calculateDamage, useSkill, applyEffect, rewardPlayer)
 *
 * Damage formula: Attack * Random(0.8, 1.2) - Defense * 0.5, min 1
 */
UCLASS(ClassGroup=(Custom), meta=(BlueprintSpawnableComponent))
class LONGEVITYGAME_API UBattleComponent : public UActorComponent
{
    GENERATED_BODY()

public:
    UBattleComponent();

    // --- Combat Stats ---

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Combat")
    float MaxHP = 100.0f;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Combat")
    float CurrentHP = 100.0f;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Combat")
    float Attack = 10.0f;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Combat")
    float Defense = 5.0f;

    // --- Skills ---

    /** Equipped skill IDs (max 3 active slots) */
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Skills")
    TArray<FName> EquippedSkills;

    /** DataTable for skill definitions */
    UPROPERTY(EditDefaultsOnly, Category = "Skills")
    TObjectPtr<UDataTable> SkillDataTable;

    // --- Public API ---

    /** Calculate damage this component would deal to a target */
    UFUNCTION(BlueprintCallable, Category = "Combat")
    float CalculateDamage(UBattleComponent* Target) const;

    /** Use a skill by its ID against a target */
    UFUNCTION(BlueprintCallable, Category = "Combat")
    bool UseSkill(FName SkillId, AActor* Target);

    /** Use skill by equipped slot index (0-2) */
    UFUNCTION(BlueprintCallable, Category = "Combat")
    bool UseSkillByIndex(int32 SlotIndex);

    /** Apply damage to this component */
    UFUNCTION(BlueprintCallable, Category = "Combat")
    void TakeDamage(float Amount, AActor* Instigator);

    /** Heal this component */
    UFUNCTION(BlueprintCallable, Category = "Combat")
    void Heal(float Amount);

    /** Check if a skill is off cooldown */
    UFUNCTION(BlueprintPure, Category = "Combat")
    bool IsSkillReady(FName SkillId) const;

    /** Get remaining cooldown for a skill (seconds) */
    UFUNCTION(BlueprintPure, Category = "Combat")
    float GetSkillCooldownRemaining(FName SkillId) const;

    /** Is this entity alive? */
    UFUNCTION(BlueprintPure, Category = "Combat")
    bool IsAlive() const { return CurrentHP > 0.0f; }

    /** Get health as 0-1 fraction */
    UFUNCTION(BlueprintPure, Category = "Combat")
    float GetHealthPercent() const { return MaxHP > 0.0f ? CurrentHP / MaxHP : 0.0f; }

    // --- Events ---

    UPROPERTY(BlueprintAssignable, Category = "Combat")
    FOnDamageDealt OnDamageDealt;

    UPROPERTY(BlueprintAssignable, Category = "Combat")
    FOnDamageTaken OnDamageTaken;

    UPROPERTY(BlueprintAssignable, Category = "Combat")
    FOnDeath OnDeath;

    UPROPERTY(BlueprintAssignable, Category = "Combat")
    FOnHealthChanged OnHealthChanged;

protected:
    virtual void BeginPlay() override;
    virtual void TickComponent(float DeltaTime, ELevelTick TickType, FActorComponentTickFunction* ThisTickFunction) override;

private:
    /** Skill cooldown tracking: SkillId -> WorldTime when usable again */
    TMap<FName, float> SkillCooldowns;

    void ApplyEffect(const FSkillEffect& Effect);
    const FSkillData* GetSkillData(FName SkillId) const;
    AActor* FindCurrentTarget() const;
};
