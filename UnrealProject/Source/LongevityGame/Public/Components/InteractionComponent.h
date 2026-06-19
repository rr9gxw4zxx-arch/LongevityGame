#pragma once

#include "CoreMinimal.h"
#include "Components/ActorComponent.h"
#include "InteractionComponent.generated.h"

DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnInteractionAvailable, AActor*, InteractableActor);
DECLARE_DYNAMIC_MULTICAST_DELEGATE(FOnInteractionUnavailable);

/**
 * Handles proximity-based interaction detection.
 * Maps from: NPC.js isNearby() + talkRadius logic
 *
 * Attached to the player character, detects nearby interactable actors.
 */
UCLASS(ClassGroup=(Custom), meta=(BlueprintSpawnableComponent))
class LONGEVITYGAME_API UInteractionComponent : public UActorComponent
{
    GENERATED_BODY()

public:
    UInteractionComponent();

    /** Radius for detecting interactable actors (cm) */
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Interaction")
    float InteractionRadius = 150.0f; // ~60 pixels * 2.5 scale

    /** Try to interact with the closest interactable */
    UFUNCTION(BlueprintCallable, Category = "Interaction")
    void TryInteract();

    /** Get closest interactable actor, if any */
    UFUNCTION(BlueprintPure, Category = "Interaction")
    AActor* GetClosestInteractable() const;

    // --- Events ---

    UPROPERTY(BlueprintAssignable, Category = "Interaction")
    FOnInteractionAvailable OnInteractionAvailable;

    UPROPERTY(BlueprintAssignable, Category = "Interaction")
    FOnInteractionUnavailable OnInteractionUnavailable;

protected:
    virtual void TickComponent(float DeltaTime, ELevelTick TickType, FActorComponentTickFunction* ThisTickFunction) override;

private:
    UPROPERTY()
    TWeakObjectPtr<AActor> CurrentInteractable;

    void UpdateClosestInteractable();
};
