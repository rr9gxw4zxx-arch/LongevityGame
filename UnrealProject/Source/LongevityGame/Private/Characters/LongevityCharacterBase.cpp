#include "Characters/LongevityCharacterBase.h"
#include "Components/BattleComponent.h"
#include "LongevityGame.h"

ALongevityCharacterBase::ALongevityCharacterBase()
{
    PrimaryActorTick.bCanEverTick = true;

    BattleComponent = CreateDefaultSubobject<UBattleComponent>(TEXT("BattleComponent"));
}

void ALongevityCharacterBase::BeginPlay()
{
    Super::BeginPlay();

    if (BattleComponent)
    {
        BattleComponent->OnDeath.AddDynamic(this, &ALongevityCharacterBase::HandleDeath);
    }
}

bool ALongevityCharacterBase::IsAlive() const
{
    return BattleComponent && BattleComponent->IsAlive();
}

void ALongevityCharacterBase::HandleDeath()
{
    UE_LOG(LogLongevity, Log, TEXT("%s has fallen..."), *CharacterName.ToString());
}
