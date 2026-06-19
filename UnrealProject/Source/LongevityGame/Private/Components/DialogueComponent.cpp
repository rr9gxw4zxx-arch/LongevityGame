#include "Components/DialogueComponent.h"
#include "LongevityGame.h"

UDialogueComponent::UDialogueComponent()
{
    PrimaryComponentTick.bCanEverTick = false;
}

void UDialogueComponent::StartDialogue()
{
    if (DialogueLines.Num() == 0) return;

    bIsInDialogue = true;
    CurrentLineIndex = 0;

    OnDialogueStarted.Broadcast(GetOwner(), GetCurrentLine());

    UE_LOG(LogLongevity, Log, TEXT("Dialogue started with %s"), *GetOwner()->GetName());
}

void UDialogueComponent::AdvanceDialogue()
{
    if (!bIsInDialogue || DialogueLines.Num() == 0) return;

    // Cycle back to beginning after last line (matches JS: (index + 1) % length)
    CurrentLineIndex = (CurrentLineIndex + 1) % DialogueLines.Num();

    OnDialogueAdvanced.Broadcast(GetCurrentLine(), CurrentLineIndex);
}

void UDialogueComponent::EndDialogue()
{
    bIsInDialogue = false;
    OnDialogueEnded.Broadcast();

    UE_LOG(LogLongevity, Log, TEXT("Dialogue ended with %s"), *GetOwner()->GetName());
}

FText UDialogueComponent::GetCurrentLine() const
{
    if (DialogueLines.IsValidIndex(CurrentLineIndex))
    {
        return DialogueLines[CurrentLineIndex];
    }
    return FText::GetEmpty();
}
