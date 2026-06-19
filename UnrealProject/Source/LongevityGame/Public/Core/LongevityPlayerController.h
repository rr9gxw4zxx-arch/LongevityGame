#pragma once

#include "CoreMinimal.h"
#include "GameFramework/PlayerController.h"
#include "LongevityPlayerController.generated.h"

class UInputMappingContext;
class UInputAction;

/**
 * Player controller handling input mapping.
 * Maps from: PlayerController.js (WASD, sprint, interact, skills)
 *
 * Uses Enhanced Input for cross-platform support (keyboard + gamepad + touch).
 */
UCLASS()
class LONGEVITYGAME_API ALongevityPlayerController : public APlayerController
{
    GENERATED_BODY()

public:
    ALongevityPlayerController();

protected:
    virtual void BeginPlay() override;
    virtual void SetupInputComponent() override;

    /** Input mapping context for exploration */
    UPROPERTY(EditDefaultsOnly, Category = "Input")
    TObjectPtr<UInputMappingContext> ExplorationMappingContext;

    /** Input mapping context for combat */
    UPROPERTY(EditDefaultsOnly, Category = "Input")
    TObjectPtr<UInputMappingContext> CombatMappingContext;

    // Input actions
    UPROPERTY(EditDefaultsOnly, Category = "Input")
    TObjectPtr<UInputAction> MoveAction;

    UPROPERTY(EditDefaultsOnly, Category = "Input")
    TObjectPtr<UInputAction> SprintAction;

    UPROPERTY(EditDefaultsOnly, Category = "Input")
    TObjectPtr<UInputAction> InteractAction;

    UPROPERTY(EditDefaultsOnly, Category = "Input")
    TObjectPtr<UInputAction> Skill1Action;

    UPROPERTY(EditDefaultsOnly, Category = "Input")
    TObjectPtr<UInputAction> Skill2Action;

    UPROPERTY(EditDefaultsOnly, Category = "Input")
    TObjectPtr<UInputAction> Skill3Action;

    UPROPERTY(EditDefaultsOnly, Category = "Input")
    TObjectPtr<UInputAction> PauseAction;

private:
    void OnMove(const struct FInputActionValue& Value);
    void OnSprintStarted();
    void OnSprintCompleted();
    void OnInteract();
    void OnSkill1();
    void OnSkill2();
    void OnSkill3();
    void OnPause();
};
