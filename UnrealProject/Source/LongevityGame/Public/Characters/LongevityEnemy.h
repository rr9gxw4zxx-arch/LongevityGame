#pragma once

#include "CoreMinimal.h"
#include "Characters/LongevityCharacterBase.h"
#include "Data/LongevityDataTypes.h"
#include "LongevityEnemy.generated.h"

DECLARE_DYNAMIC_MULTICAST_DELEGATE_TwoParams(FOnEnemyDefeated, ALongevityEnemy*, Enemy, AActor*, Killer);

/**
 * Enemy character with patrol AI.
 * Maps from: Enemy.js (movement timer, direction changes, boundary clamping)
 *
 * AI behavior:
 * - Patrol: Random wandering within bounds (moveInterval: 2-4s)
 * - Chase: Pursue player when detected
 * - Attack: Enter combat at range
 */
UCLASS()
class LONGEVITYGAME_API ALongevityEnemy : public ALongevityCharacterBase
{
    GENERATED_BODY()

public:
    ALongevityEnemy();

    /** Initialize from enemy data (called after spawn) */
    UFUNCTION(BlueprintCallable, Category = "Enemy")
    void InitializeFromData(const FEnemyData& Data);

    /** Experience reward on death */
    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Rewards")
    float ExperienceReward = 20.0f;

    /** Gold reward on death */
    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Rewards")
    int32 GoldReward = 10;

    /** Is this a boss enemy? */
    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Enemy")
    bool bIsBoss = false;

    /** Enemy unique ID (for data table lookup) */
    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Enemy")
    FName EnemyId;

    // --- Events ---

    UPROPERTY(BlueprintAssignable, Category = "Enemy")
    FOnEnemyDefeated OnEnemyDefeated;

protected:
    virtual void BeginPlay() override;
    virtual void Tick(float DeltaTime) override;
    virtual void HandleDeath() override;

    // --- Patrol AI (matches JS: moveTimer, moveInterval, targetDirection) ---

    /** Time between direction changes */
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "AI|Patrol")
    float PatrolInterval = 3.0f;

    /** Patrol movement speed */
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "AI|Patrol")
    float PatrolSpeed = 150.0f;

    /** Chase movement speed */
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "AI|Patrol")
    float ChaseSpeed = 300.0f;

    /** Detection radius for player */
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "AI|Patrol")
    float DetectionRadius = 500.0f;

    /** Patrol boundary (enemy reverses at edges, matches JS boundary check) */
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "AI|Patrol")
    FVector PatrolOrigin = FVector::ZeroVector;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "AI|Patrol")
    float PatrolBounds = 4000.0f; // cm (matches JS: 1600px * 2.5)

private:
    float PatrolTimer = 0.0f;
    FVector PatrolDirection = FVector::ZeroVector;

    void UpdatePatrol(float DeltaTime);
    void ChooseNewPatrolDirection();
    void ClampToBounds();
};
