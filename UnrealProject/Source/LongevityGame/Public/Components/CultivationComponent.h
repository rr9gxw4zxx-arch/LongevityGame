#pragma once

#include "CoreMinimal.h"
#include "Components/ActorComponent.h"
#include "Data/LongevityDataTypes.h"
#include "CultivationComponent.generated.h"

DECLARE_DYNAMIC_MULTICAST_DELEGATE_TwoParams(FOnRealmChanged, int32, OldRealm, int32, NewRealm);
DECLARE_DYNAMIC_MULTICAST_DELEGATE_TwoParams(FOnLevelUp, int32, OldLevel, int32, NewLevel);
DECLARE_DYNAMIC_MULTICAST_DELEGATE_TwoParams(FOnExperienceChanged, float, CurrentExp, float, ExpToNext);

/**
 * Manages cultivation realm progression.
 * Maps from: CULTIVATION_REALMS in WorldData.js + checkLevelUp() in BattleSystem.js
 *
 * 15 realms: 炼气期 → 筑基期 → ... → 圣人
 * Each realm has a stat multiplier that scales combat power.
 */
UCLASS(ClassGroup=(Custom), meta=(BlueprintSpawnableComponent))
class LONGEVITYGAME_API UCultivationComponent : public UActorComponent
{
    GENERATED_BODY()

public:
    UCultivationComponent();

    // --- Public API ---

    /** Add experience points, potentially triggering level up */
    UFUNCTION(BlueprintCallable, Category = "Cultivation")
    void AddExperience(float Amount);

    /** Attempt to breakthrough to next realm (requires max level in current realm) */
    UFUNCTION(BlueprintCallable, Category = "Cultivation")
    bool TryBreakthrough();

    /** Get the stat multiplier for current realm */
    UFUNCTION(BlueprintPure, Category = "Cultivation")
    float GetRealmMultiplier() const;

    /** Get current realm name */
    UFUNCTION(BlueprintPure, Category = "Cultivation")
    FText GetRealmName() const;

    // --- Getters ---

    UFUNCTION(BlueprintPure, Category = "Cultivation")
    int32 GetCurrentRealm() const { return CurrentRealm; }

    UFUNCTION(BlueprintPure, Category = "Cultivation")
    int32 GetCurrentLevel() const { return CurrentLevel; }

    UFUNCTION(BlueprintPure, Category = "Cultivation")
    float GetCurrentExperience() const { return CurrentExperience; }

    UFUNCTION(BlueprintPure, Category = "Cultivation")
    float GetExperienceToNextLevel() const { return ExperienceToNextLevel; }

    // --- Events ---

    UPROPERTY(BlueprintAssignable, Category = "Cultivation")
    FOnRealmChanged OnRealmChanged;

    UPROPERTY(BlueprintAssignable, Category = "Cultivation")
    FOnLevelUp OnLevelUp;

    UPROPERTY(BlueprintAssignable, Category = "Cultivation")
    FOnExperienceChanged OnExperienceChanged;

protected:
    virtual void BeginPlay() override;

    /** DataTable containing realm definitions */
    UPROPERTY(EditDefaultsOnly, Category = "Cultivation")
    TObjectPtr<UDataTable> RealmDataTable;

    /** Current cultivation realm (1-15) */
    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Cultivation", meta = (ClampMin = "1", ClampMax = "15"))
    int32 CurrentRealm = 1;

    /** Current level within realm */
    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Cultivation", meta = (ClampMin = "1"))
    int32 CurrentLevel = 1;

    /** Current experience points */
    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Cultivation")
    float CurrentExperience = 0.0f;

    /** Experience needed for next level */
    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Cultivation")
    float ExperienceToNextLevel = 100.0f;

    /** Maximum realm (圣人 = 15) */
    static constexpr int32 MaxRealm = 15;

private:
    void CheckLevelUp();
    void CalculateExpToNextLevel();
    const FCultivationRealmData* GetRealmData(int32 RealmId) const;
};
