#include "Characters/LongevityEnemy.h"
#include "Components/BattleComponent.h"
#include "GameFramework/CharacterMovementComponent.h"
#include "LongevityGame.h"

ALongevityEnemy::ALongevityEnemy()
{
    PrimaryActorTick.bCanEverTick = true;

    // Randomize patrol interval (matches JS: 2 + Math.random() * 2)
    PatrolInterval = FMath::FRandRange(2.0f, 4.0f);
}

void ALongevityEnemy::InitializeFromData(const FEnemyData& Data)
{
    EnemyId = Data.EnemyId;
    CharacterName = Data.EnemyName;
    Realm = Data.Realm;
    bIsBoss = Data.bIsBoss;
    ExperienceReward = Data.ExperienceReward;
    GoldReward = Data.GoldReward;
    PatrolSpeed = Data.PatrolSpeed;
    ChaseSpeed = Data.ChaseSpeed;

    if (BattleComponent)
    {
        BattleComponent->MaxHP = Data.MaxHP;
        BattleComponent->CurrentHP = Data.MaxHP;
        BattleComponent->Attack = Data.Attack;
        BattleComponent->Defense = Data.Defense;
    }

    UE_LOG(LogLongevity, Log, TEXT("Enemy %s initialized (Realm %d, HP %.0f)"),
        *CharacterName.ToString(), Realm, Data.MaxHP);
}

void ALongevityEnemy::BeginPlay()
{
    Super::BeginPlay();
    PatrolOrigin = GetActorLocation();
    ChooseNewPatrolDirection();
}

void ALongevityEnemy::Tick(float DeltaTime)
{
    Super::Tick(DeltaTime);

    if (!IsAlive()) return;

    UpdatePatrol(DeltaTime);
}

void ALongevityEnemy::UpdatePatrol(float DeltaTime)
{
    // Matches JS: moveTimer += dt; if (moveTimer >= moveInterval) { change direction }
    PatrolTimer += DeltaTime;

    if (PatrolTimer >= PatrolInterval)
    {
        PatrolTimer = 0.0f;
        ChooseNewPatrolDirection();
    }

    // Apply movement
    AddMovementInput(PatrolDirection, 1.0f);
    GetCharacterMovement()->MaxWalkSpeed = PatrolSpeed;

    // Boundary check (matches JS: if x < 0 || x > 1600 then reverse)
    ClampToBounds();
}

void ALongevityEnemy::ChooseNewPatrolDirection()
{
    // Matches JS: targetDirection = { x: (random-0.5)*2, y: (random-0.5)*2 }
    PatrolDirection = FVector(
        FMath::FRandRange(-1.0f, 1.0f),
        FMath::FRandRange(-1.0f, 1.0f),
        0.0f
    ).GetSafeNormal();
}

void ALongevityEnemy::ClampToBounds()
{
    const FVector CurrentLocation = GetActorLocation();
    const FVector Delta = CurrentLocation - PatrolOrigin;

    // Matches JS: reverse direction when out of bounds
    if (FMath::Abs(Delta.X) > PatrolBounds || FMath::Abs(Delta.Y) > PatrolBounds)
    {
        PatrolDirection *= -1.0f;
    }
}

void ALongevityEnemy::HandleDeath()
{
    Super::HandleDeath();

    UE_LOG(LogLongevity, Log, TEXT("Enemy %s defeated! Rewards: %.0f exp, %d gold"),
        *CharacterName.ToString(), ExperienceReward, GoldReward);

    OnEnemyDefeated.Broadcast(this, nullptr); // Killer set by battle system

    // Disable collision and start death animation
    SetActorEnableCollision(false);

    // Destroy after delay (for death animation)
    SetLifeSpan(3.0f);
}
