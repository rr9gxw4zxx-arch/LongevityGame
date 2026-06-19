#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Character.h"
#include "LongevityCharacterBase.generated.h"

class UBattleComponent;

/**
 * Base character class for all game characters.
 * Maps from: Entity.js (position, velocity, alive state)
 *
 * Provides shared functionality: movement, battle component, death handling.
 */
UCLASS(Abstract)
class LONGEVITYGAME_API ALongevityCharacterBase : public ACharacter
{
    GENERATED_BODY()

public:
    ALongevityCharacterBase();

    /** Character display name */
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Character")
    FText CharacterName;

    /** Character's cultivation realm */
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Character")
    int32 Realm = 1;

    /** Get the battle component */
    UFUNCTION(BlueprintPure, Category = "Combat")
    UBattleComponent* GetBattleComponent() const { return BattleComponent; }

    /** Is this character alive? */
    UFUNCTION(BlueprintPure, Category = "Character")
    bool IsAlive() const;

protected:
    virtual void BeginPlay() override;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Components")
    TObjectPtr<UBattleComponent> BattleComponent;

    /** Called when this character dies */
    UFUNCTION()
    virtual void HandleDeath();
};
