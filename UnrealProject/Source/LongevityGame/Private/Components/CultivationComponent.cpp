#include "Components/CultivationComponent.h"
#include "LongevityGame.h"

UCultivationComponent::UCultivationComponent()
{
    PrimaryComponentTick.bCanEverTick = false;
}

void UCultivationComponent::BeginPlay()
{
    Super::BeginPlay();
    CalculateExpToNextLevel();
}

void UCultivationComponent::AddExperience(float Amount)
{
    if (Amount <= 0.0f) return;

    CurrentExperience += Amount;
    OnExperienceChanged.Broadcast(CurrentExperience, ExperienceToNextLevel);

    CheckLevelUp();
}

void UCultivationComponent::CheckLevelUp()
{
    while (CurrentExperience >= ExperienceToNextLevel)
    {
        CurrentExperience -= ExperienceToNextLevel;

        const int32 OldLevel = CurrentLevel;
        CurrentLevel++;

        UE_LOG(LogLongevity, Log, TEXT("Level up! %d -> %d (Realm %d)"), OldLevel, CurrentLevel, CurrentRealm);

        OnLevelUp.Broadcast(OldLevel, CurrentLevel);
        CalculateExpToNextLevel();
        OnExperienceChanged.Broadcast(CurrentExperience, ExperienceToNextLevel);
    }
}

bool UCultivationComponent::TryBreakthrough()
{
    if (CurrentRealm >= MaxRealm)
    {
        UE_LOG(LogLongevity, Warning, TEXT("Already at maximum realm (圣人)"));
        return false;
    }

    // Breakthrough requires reaching level 10 in current realm
    if (CurrentLevel < 10)
    {
        UE_LOG(LogLongevity, Log, TEXT("Breakthrough failed: need level 10, currently %d"), CurrentLevel);
        return false;
    }

    const int32 OldRealm = CurrentRealm;
    CurrentRealm++;
    CurrentLevel = 1;
    CurrentExperience = 0.0f;
    CalculateExpToNextLevel();

    UE_LOG(LogLongevity, Log, TEXT("Breakthrough! Realm %d -> %d"), OldRealm, CurrentRealm);

    OnRealmChanged.Broadcast(OldRealm, CurrentRealm);
    OnExperienceChanged.Broadcast(CurrentExperience, ExperienceToNextLevel);

    return true;
}

float UCultivationComponent::GetRealmMultiplier() const
{
    if (const FCultivationRealmData* Data = GetRealmData(CurrentRealm))
    {
        return Data->StatMultiplier;
    }

    // Fallback multipliers if no DataTable
    static const float DefaultMultipliers[] = {
        1.0f, 1.5f, 2.0f, 3.0f, 4.0f, 5.0f, 6.0f, 8.0f, 10.0f,
        15.0f, 20.0f, 30.0f, 50.0f, 100.0f, 1000.0f
    };

    const int32 Index = FMath::Clamp(CurrentRealm - 1, 0, 14);
    return DefaultMultipliers[Index];
}

FText UCultivationComponent::GetRealmName() const
{
    if (const FCultivationRealmData* Data = GetRealmData(CurrentRealm))
    {
        return Data->RealmName;
    }

    // Fallback names
    static const FString DefaultNames[] = {
        TEXT("炼气期"), TEXT("筑基期"), TEXT("金丹期"), TEXT("元婴期"),
        TEXT("化神期"), TEXT("炼虚期"), TEXT("合体期"), TEXT("大乘期"),
        TEXT("渡劫期"), TEXT("真仙"), TEXT("金仙"), TEXT("太乙金仙"),
        TEXT("大罗金仙"), TEXT("准圣"), TEXT("圣人")
    };

    const int32 Index = FMath::Clamp(CurrentRealm - 1, 0, 14);
    return FText::FromString(DefaultNames[Index]);
}

void UCultivationComponent::CalculateExpToNextLevel()
{
    // Formula: Level * 100 * RealmMultiplier
    // Matches JS: expNeeded = player.level * 100
    ExperienceToNextLevel = CurrentLevel * 100.0f * FMath::Max(1.0f, (float)CurrentRealm * 0.5f);
}

const FCultivationRealmData* UCultivationComponent::GetRealmData(int32 RealmId) const
{
    if (!RealmDataTable) return nullptr;

    const FString RowName = FString::Printf(TEXT("Realm_%d"), RealmId);
    return RealmDataTable->FindRow<FCultivationRealmData>(*RowName, TEXT("GetRealmData"));
}
