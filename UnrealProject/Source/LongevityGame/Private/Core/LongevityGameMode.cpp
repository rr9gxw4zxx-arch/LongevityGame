#include "Core/LongevityGameMode.h"
#include "LongevityGame.h"

ALongevityGameMode::ALongevityGameMode()
{
    PrimaryActorTick.bCanEverTick = true;
}

void ALongevityGameMode::BeginPlay()
{
    Super::BeginPlay();
    UE_LOG(LogLongevity, Log, TEXT("LongevityGameMode initialized. World time: %.1f"), WorldTime);
}

void ALongevityGameMode::Tick(float DeltaTime)
{
    Super::Tick(DeltaTime);

    if (!bIsGamePaused)
    {
        UpdateWorldTime(DeltaTime);
    }
}

void ALongevityGameMode::SaveGame()
{
    // TODO: Implement SaveGame using USaveGame system
    UE_LOG(LogLongevity, Log, TEXT("Game saved"));
}

void ALongevityGameMode::LoadGame()
{
    // TODO: Implement LoadGame using USaveGame system
    UE_LOG(LogLongevity, Log, TEXT("Game loaded"));
}

void ALongevityGameMode::UpdateWorldTime(float DeltaTime)
{
    WorldTime += (DeltaTime * TimeScale) / 3600.0f;
    if (WorldTime >= 24.0f)
    {
        WorldTime -= 24.0f;
    }
}
