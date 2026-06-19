#include "Core/LongevityPlayerController.h"
#include "EnhancedInputComponent.h"
#include "EnhancedInputSubsystems.h"
#include "Characters/LongevityPlayerCharacter.h"
#include "Components/BattleComponent.h"
#include "Components/InteractionComponent.h"

ALongevityPlayerController::ALongevityPlayerController()
{
}

void ALongevityPlayerController::BeginPlay()
{
    Super::BeginPlay();

    // Add input mapping context
    if (UEnhancedInputLocalPlayerSubsystem* Subsystem =
        ULocalPlayer::GetSubsystem<UEnhancedInputLocalPlayerSubsystem>(GetLocalPlayer()))
    {
        if (ExplorationMappingContext)
        {
            Subsystem->AddMappingContext(ExplorationMappingContext, 0);
        }
    }
}

void ALongevityPlayerController::SetupInputComponent()
{
    Super::SetupInputComponent();

    if (UEnhancedInputComponent* EnhancedInput = Cast<UEnhancedInputComponent>(InputComponent))
    {
        if (MoveAction)
        {
            EnhancedInput->BindAction(MoveAction, ETriggerEvent::Triggered, this, &ALongevityPlayerController::OnMove);
        }
        if (SprintAction)
        {
            EnhancedInput->BindAction(SprintAction, ETriggerEvent::Started, this, &ALongevityPlayerController::OnSprintStarted);
            EnhancedInput->BindAction(SprintAction, ETriggerEvent::Completed, this, &ALongevityPlayerController::OnSprintCompleted);
        }
        if (InteractAction)
        {
            EnhancedInput->BindAction(InteractAction, ETriggerEvent::Started, this, &ALongevityPlayerController::OnInteract);
        }
        if (Skill1Action)
        {
            EnhancedInput->BindAction(Skill1Action, ETriggerEvent::Started, this, &ALongevityPlayerController::OnSkill1);
        }
        if (Skill2Action)
        {
            EnhancedInput->BindAction(Skill2Action, ETriggerEvent::Started, this, &ALongevityPlayerController::OnSkill2);
        }
        if (Skill3Action)
        {
            EnhancedInput->BindAction(Skill3Action, ETriggerEvent::Started, this, &ALongevityPlayerController::OnSkill3);
        }
        if (PauseAction)
        {
            EnhancedInput->BindAction(PauseAction, ETriggerEvent::Started, this, &ALongevityPlayerController::OnPause);
        }
    }
}

void ALongevityPlayerController::OnMove(const FInputActionValue& Value)
{
    const FVector2D MoveVector = Value.Get<FVector2D>();

    if (ALongevityPlayerCharacter* PlayerChar = Cast<ALongevityPlayerCharacter>(GetPawn()))
    {
        PlayerChar->HandleMoveInput(MoveVector);
    }
}

void ALongevityPlayerController::OnSprintStarted()
{
    if (ALongevityPlayerCharacter* PlayerChar = Cast<ALongevityPlayerCharacter>(GetPawn()))
    {
        PlayerChar->StartSprint();
    }
}

void ALongevityPlayerController::OnSprintCompleted()
{
    if (ALongevityPlayerCharacter* PlayerChar = Cast<ALongevityPlayerCharacter>(GetPawn()))
    {
        PlayerChar->StopSprint();
    }
}

void ALongevityPlayerController::OnInteract()
{
    if (ALongevityPlayerCharacter* PlayerChar = Cast<ALongevityPlayerCharacter>(GetPawn()))
    {
        if (UInteractionComponent* Interaction = PlayerChar->FindComponentByClass<UInteractionComponent>())
        {
            Interaction->TryInteract();
        }
    }
}

void ALongevityPlayerController::OnSkill1()
{
    if (ALongevityPlayerCharacter* PlayerChar = Cast<ALongevityPlayerCharacter>(GetPawn()))
    {
        if (UBattleComponent* Battle = PlayerChar->FindComponentByClass<UBattleComponent>())
        {
            Battle->UseSkillByIndex(0);
        }
    }
}

void ALongevityPlayerController::OnSkill2()
{
    if (ALongevityPlayerCharacter* PlayerChar = Cast<ALongevityPlayerCharacter>(GetPawn()))
    {
        if (UBattleComponent* Battle = PlayerChar->FindComponentByClass<UBattleComponent>())
        {
            Battle->UseSkillByIndex(1);
        }
    }
}

void ALongevityPlayerController::OnSkill3()
{
    if (ALongevityPlayerCharacter* PlayerChar = Cast<ALongevityPlayerCharacter>(GetPawn()))
    {
        if (UBattleComponent* Battle = PlayerChar->FindComponentByClass<UBattleComponent>())
        {
            Battle->UseSkillByIndex(2);
        }
    }
}

void ALongevityPlayerController::OnPause()
{
    // Toggle pause menu - handled by UI widget
}
