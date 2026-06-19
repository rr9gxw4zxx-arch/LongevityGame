#pragma once

#include "CoreMinimal.h"
#include "Components/ActorComponent.h"
#include "DialogueComponent.generated.h"

DECLARE_DYNAMIC_MULTICAST_DELEGATE_TwoParams(FOnDialogueStarted, AActor*, NPC, FText, FirstLine);
DECLARE_DYNAMIC_MULTICAST_DELEGATE(FOnDialogueEnded);
DECLARE_DYNAMIC_MULTICAST_DELEGATE_TwoParams(FOnDialogueAdvanced, FText, NewLine, int32, LineIndex);

/**
 * Manages NPC dialogue lines and conversation state.
 * Maps from: NPC.js (getCurrentDialogue, nextDialogue, startDialogue, endDialogue)
 */
UCLASS(ClassGroup=(Custom), meta=(BlueprintSpawnableComponent))
class LONGEVITYGAME_API UDialogueComponent : public UActorComponent
{
    GENERATED_BODY()

public:
    UDialogueComponent();

    /** All dialogue lines for this NPC */
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Dialogue")
    TArray<FText> DialogueLines;

    /** Start a dialogue interaction */
    UFUNCTION(BlueprintCallable, Category = "Dialogue")
    void StartDialogue();

    /** Advance to next dialogue line (cycles back to 0 after last) */
    UFUNCTION(BlueprintCallable, Category = "Dialogue")
    void AdvanceDialogue();

    /** End the dialogue interaction */
    UFUNCTION(BlueprintCallable, Category = "Dialogue")
    void EndDialogue();

    /** Get current dialogue line */
    UFUNCTION(BlueprintPure, Category = "Dialogue")
    FText GetCurrentLine() const;

    /** Is currently in dialogue? */
    UFUNCTION(BlueprintPure, Category = "Dialogue")
    bool IsInDialogue() const { return bIsInDialogue; }

    /** Get current line index */
    UFUNCTION(BlueprintPure, Category = "Dialogue")
    int32 GetCurrentLineIndex() const { return CurrentLineIndex; }

    // --- Events ---

    UPROPERTY(BlueprintAssignable, Category = "Dialogue")
    FOnDialogueStarted OnDialogueStarted;

    UPROPERTY(BlueprintAssignable, Category = "Dialogue")
    FOnDialogueEnded OnDialogueEnded;

    UPROPERTY(BlueprintAssignable, Category = "Dialogue")
    FOnDialogueAdvanced OnDialogueAdvanced;

protected:
    UPROPERTY(BlueprintReadOnly, Category = "Dialogue")
    int32 CurrentLineIndex = 0;

    UPROPERTY(BlueprintReadOnly, Category = "Dialogue")
    bool bIsInDialogue = false;
};
