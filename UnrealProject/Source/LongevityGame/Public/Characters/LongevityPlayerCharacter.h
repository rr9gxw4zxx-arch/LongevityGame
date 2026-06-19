#pragma once

#include "CoreMinimal.h"
#include "Characters/LongevityCharacterBase.h"
#include "LongevityPlayerCharacter.generated.h"

class UCultivationComponent;
class UInteractionComponent;
class USpringArmComponent;
class UCameraComponent;

/**
 * Player character - 李长寿.
 * Maps from: Player.js (stats, skills, movement, clamp position)
 *
 * Features:
 * - Third-person camera with spring arm
 * - Cultivation progression
 * - Sprint mechanic (1.8x speed multiplier)
 * - Interaction with NPCs
 */
UCLASS()
class LONGEVITYGAME_API ALongevityPlayerCharacter : public ALongevityCharacterBase
{
    GENERATED_BODY()

public:
    ALongevityPlayerCharacter();

    // --- Movement ---

    /** Handle directional movement input from controller */
    UFUNCTION(BlueprintCallable, Category = "Movement")
    void HandleMoveInput(const FVector2D& InputVector);

    /** Start sprinting */
    UFUNCTION(BlueprintCallable, Category = "Movement")
    void StartSprint();

    /** Stop sprinting */
    UFUNCTION(BlueprintCallable, Category = "Movement")
    void StopSprint();

    /** Is the player currently sprinting? */
    UFUNCTION(BlueprintPure, Category = "Movement")
    bool IsSprinting() const { return bIsSprinting; }

    // --- Stats ---

    /** Player's gold currency */
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Stats")
    int32 Gold = 0;

    /** Player title (e.g., 太白金星) */
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Character")
    FText Title;

    // --- Components ---

    UFUNCTION(BlueprintPure, Category = "Components")
    UCultivationComponent* GetCultivationComponent() const { return CultivationComponent; }

protected:
    virtual void BeginPlay() override;
    virtual void Tick(float DeltaTime) override;
    virtual void HandleDeath() override;

    // --- Components ---

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Components")
    TObjectPtr<UCultivationComponent> CultivationComponent;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Components")
    TObjectPtr<UInteractionComponent> InteractionComponent;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Camera")
    TObjectPtr<USpringArmComponent> SpringArmComponent;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Camera")
    TObjectPtr<UCameraComponent> CameraComponent;

    // --- Movement Settings ---

    /** Base walk speed (cm/s) */
    UPROPERTY(EditDefaultsOnly, Category = "Movement")
    float BaseWalkSpeed = 300.0f;

    /** Sprint speed multiplier (matches JS: sprintMultiplier = 1.8) */
    UPROPERTY(EditDefaultsOnly, Category = "Movement")
    float SprintMultiplier = 1.8f;

private:
    bool bIsSprinting = false;
};
