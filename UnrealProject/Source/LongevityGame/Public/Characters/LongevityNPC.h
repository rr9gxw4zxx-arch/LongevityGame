#pragma once

#include "CoreMinimal.h"
#include "Characters/LongevityCharacterBase.h"
#include "Data/LongevityDataTypes.h"
#include "LongevityNPC.generated.h"

class UDialogueComponent;

/**
 * NPC character with dialogue support.
 * Maps from: NPC.js (dialogue, interaction radius, role)
 */
UCLASS()
class LONGEVITYGAME_API ALongevityNPC : public ALongevityCharacterBase
{
    GENERATED_BODY()

public:
    ALongevityNPC();

    /** Initialize from NPC data */
    UFUNCTION(BlueprintCallable, Category = "NPC")
    void InitializeFromData(const FNPCData& Data);

    /** NPC role (师父, 师姐, 师兄) */
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "NPC")
    FText Role;

    /** Get the dialogue component */
    UFUNCTION(BlueprintPure, Category = "NPC")
    UDialogueComponent* GetDialogueComponent() const { return DialogueComponent; }

protected:
    virtual void BeginPlay() override;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Components")
    TObjectPtr<UDialogueComponent> DialogueComponent;
};
