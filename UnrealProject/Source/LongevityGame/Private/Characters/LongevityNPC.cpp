#include "Characters/LongevityNPC.h"
#include "Components/DialogueComponent.h"
#include "LongevityGame.h"

ALongevityNPC::ALongevityNPC()
{
    DialogueComponent = CreateDefaultSubobject<UDialogueComponent>(TEXT("DialogueComponent"));
}

void ALongevityNPC::BeginPlay()
{
    Super::BeginPlay();
}

void ALongevityNPC::InitializeFromData(const FNPCData& Data)
{
    CharacterName = Data.NPCName;
    Role = Data.Role;
    Realm = Data.Realm;

    if (DialogueComponent)
    {
        DialogueComponent->DialogueLines = Data.DialogueLines;
    }

    SetActorLocation(Data.SpawnPosition);

    UE_LOG(LogLongevity, Log, TEXT("NPC %s (%s) initialized at %s"),
        *CharacterName.ToString(), *Role.ToString(), *Data.SpawnPosition.ToString());
}
