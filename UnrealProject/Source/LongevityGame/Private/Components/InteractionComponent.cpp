#include "Components/InteractionComponent.h"
#include "Components/DialogueComponent.h"
#include "LongevityGame.h"
#include "EngineUtils.h"

UInteractionComponent::UInteractionComponent()
{
    PrimaryComponentTick.bCanEverTick = true;
    PrimaryComponentTick.TickInterval = 0.1f; // Check every 100ms, not every frame
}

void UInteractionComponent::TickComponent(float DeltaTime, ELevelTick TickType, FActorComponentTickFunction* ThisTickFunction)
{
    Super::TickComponent(DeltaTime, TickType, ThisTickFunction);
    UpdateClosestInteractable();
}

void UInteractionComponent::TryInteract()
{
    AActor* Interactable = GetClosestInteractable();
    if (!Interactable) return;

    // Try to start dialogue if the interactable has a DialogueComponent
    if (UDialogueComponent* Dialogue = Interactable->FindComponentByClass<UDialogueComponent>())
    {
        if (Dialogue->IsInDialogue())
        {
            Dialogue->AdvanceDialogue();
        }
        else
        {
            Dialogue->StartDialogue();
        }
    }
}

AActor* UInteractionComponent::GetClosestInteractable() const
{
    return CurrentInteractable.Get();
}

void UInteractionComponent::UpdateClosestInteractable()
{
    AActor* Owner = GetOwner();
    if (!Owner) return;

    const FVector OwnerLocation = Owner->GetActorLocation();
    AActor* ClosestActor = nullptr;
    float ClosestDistance = InteractionRadius;

    // Find all actors with DialogueComponent within radius
    for (TActorIterator<AActor> It(GetWorld()); It; ++It)
    {
        AActor* Actor = *It;
        if (Actor == Owner) continue;
        if (!Actor->FindComponentByClass<UDialogueComponent>()) continue;

        const float Distance = FVector::Dist(OwnerLocation, Actor->GetActorLocation());
        if (Distance < ClosestDistance)
        {
            ClosestDistance = Distance;
            ClosestActor = Actor;
        }
    }

    // Notify if interactable state changed
    if (ClosestActor != CurrentInteractable.Get())
    {
        if (ClosestActor)
        {
            OnInteractionAvailable.Broadcast(ClosestActor);
        }
        else if (CurrentInteractable.IsValid())
        {
            OnInteractionUnavailable.Broadcast();
        }
        CurrentInteractable = ClosestActor;
    }
}
