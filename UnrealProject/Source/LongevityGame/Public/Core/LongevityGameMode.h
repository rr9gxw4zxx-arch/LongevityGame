#pragma once

#include "CoreMinimal.h"
#include "GameFramework/GameModeBase.h"
#include "LongevityGameMode.generated.h"

/**
 * Main game mode for Longevity Game.
 * Maps from: GameEngine.js (manages game state, entity lifecycle)
 *
 * Responsibilities:
 * - Spawn player at correct location
 * - Manage world state (time of day, weather)
 * - Handle game-level events (save/load, pause)
 */
UCLASS()
class LONGEVITYGAME_API ALongevityGameMode : public AGameModeBase
{
    GENERATED_BODY()

public:
    ALongevityGameMode();

    virtual void BeginPlay() override;
    virtual void Tick(float DeltaTime) override;

    /** Save current game state */
    UFUNCTION(BlueprintCallable, Category = "Game")
    void SaveGame();

    /** Load saved game state */
    UFUNCTION(BlueprintCallable, Category = "Game")
    void LoadGame();

    /** Get current world time (0-24 hours) */
    UFUNCTION(BlueprintPure, Category = "World")
    float GetWorldTime() const { return WorldTime; }

protected:
    /** Current time of day (0.0 - 24.0) */
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "World")
    float WorldTime = 8.0f;

    /** Speed of day/night cycle (1.0 = real time) */
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "World")
    float TimeScale = 60.0f;

    /** Whether the game is paused */
    UPROPERTY(BlueprintReadOnly, Category = "Game")
    bool bIsGamePaused = false;

private:
    void UpdateWorldTime(float DeltaTime);
};
