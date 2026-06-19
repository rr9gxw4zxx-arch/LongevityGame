#include "Characters/LongevityPlayerCharacter.h"
#include "Components/CultivationComponent.h"
#include "Components/InteractionComponent.h"
#include "GameFramework/CharacterMovementComponent.h"
#include "GameFramework/SpringArmComponent.h"
#include "Camera/CameraComponent.h"
#include "LongevityGame.h"

ALongevityPlayerCharacter::ALongevityPlayerCharacter()
{
    // Cultivation system
    CultivationComponent = CreateDefaultSubobject<UCultivationComponent>(TEXT("CultivationComponent"));

    // Interaction detection
    InteractionComponent = CreateDefaultSubobject<UInteractionComponent>(TEXT("InteractionComponent"));

    // Third-person camera setup
    SpringArmComponent = CreateDefaultSubobject<USpringArmComponent>(TEXT("SpringArm"));
    SpringArmComponent->SetupAttachment(RootComponent);
    SpringArmComponent->TargetArmLength = 400.0f;
    SpringArmComponent->bUsePawnControlRotation = true;
    SpringArmComponent->bDoCollisionTest = true;

    CameraComponent = CreateDefaultSubobject<UCameraComponent>(TEXT("Camera"));
    CameraComponent->SetupAttachment(SpringArmComponent);

    // Character defaults
    CharacterName = FText::FromString(TEXT("李长寿"));
    Title = FText::FromString(TEXT("太白金星"));

    // Movement defaults
    GetCharacterMovement()->MaxWalkSpeed = BaseWalkSpeed;
    GetCharacterMovement()->bOrientRotationToMovement = true;
    GetCharacterMovement()->RotationRate = FRotator(0.0f, 540.0f, 0.0f);

    bUseControllerRotationYaw = false;
}

void ALongevityPlayerCharacter::BeginPlay()
{
    Super::BeginPlay();

    // Set initial combat stats (matches JS: Player constructor)
    if (BattleComponent)
    {
        BattleComponent->MaxHP = 100.0f;
        BattleComponent->CurrentHP = 100.0f;
        BattleComponent->Attack = 10.0f;
        BattleComponent->Defense = 5.0f;
    }

    UE_LOG(LogLongevity, Log, TEXT("Player character %s initialized"), *CharacterName.ToString());
}

void ALongevityPlayerCharacter::Tick(float DeltaTime)
{
    Super::Tick(DeltaTime);
}

void ALongevityPlayerCharacter::HandleMoveInput(const FVector2D& InputVector)
{
    if (InputVector.IsNearlyZero()) return;

    // Get camera forward/right directions (projected to ground plane)
    const FRotator CameraRotation = GetControlRotation();
    const FRotator YawRotation(0.0f, CameraRotation.Yaw, 0.0f);

    const FVector ForwardDir = FRotationMatrix(YawRotation).GetUnitAxis(EAxis::X);
    const FVector RightDir = FRotationMatrix(YawRotation).GetUnitAxis(EAxis::Y);

    // Apply movement (matches JS: direction normalized then multiplied by speed)
    AddMovementInput(ForwardDir, InputVector.Y);
    AddMovementInput(RightDir, InputVector.X);
}

void ALongevityPlayerCharacter::StartSprint()
{
    bIsSprinting = true;
    GetCharacterMovement()->MaxWalkSpeed = BaseWalkSpeed * SprintMultiplier;
}

void ALongevityPlayerCharacter::StopSprint()
{
    bIsSprinting = false;
    GetCharacterMovement()->MaxWalkSpeed = BaseWalkSpeed;
}

void ALongevityPlayerCharacter::HandleDeath()
{
    Super::HandleDeath();
    // Matches JS: console.log(`${this.name} 陨落了...`)
    UE_LOG(LogLongevity, Log, TEXT("%s 陨落了..."), *CharacterName.ToString());

    // TODO: Show death UI, respawn logic
}
