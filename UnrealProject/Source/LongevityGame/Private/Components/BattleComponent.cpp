#include "Components/BattleComponent.h"
#include "Components/CultivationComponent.h"
#include "LongevityGame.h"

UBattleComponent::UBattleComponent()
{
    PrimaryComponentTick.bCanEverTick = true;
}

void UBattleComponent::BeginPlay()
{
    Super::BeginPlay();
    CurrentHP = MaxHP;
}

void UBattleComponent::TickComponent(float DeltaTime, ELevelTick TickType, FActorComponentTickFunction* ThisTickFunction)
{
    Super::TickComponent(DeltaTime, TickType, ThisTickFunction);
    // Cooldown tracking uses GetWorld()->GetTimeSeconds(), no per-tick logic needed
}

float UBattleComponent::CalculateDamage(UBattleComponent* Target) const
{
    if (!Target) return 0.0f;

    float BaseDamage = Attack;

    // Apply cultivation realm multiplier if available
    if (UCultivationComponent* Cultivation = GetOwner()->FindComponentByClass<UCultivationComponent>())
    {
        BaseDamage *= Cultivation->GetRealmMultiplier();
    }

    // Random variance: 0.8 to 1.2 (matches JS: damage *= (0.8 + Math.random() * 0.4))
    const float Variance = FMath::FRandRange(0.8f, 1.2f);
    BaseDamage *= Variance;

    // Defense reduction (matches JS: damage = Math.max(1, damage - defense * 0.5))
    const float FinalDamage = FMath::Max(1.0f, BaseDamage - Target->Defense * 0.5f);

    return FinalDamage;
}

bool UBattleComponent::UseSkill(FName SkillId, AActor* Target)
{
    if (!IsAlive()) return false;

    const FSkillData* SkillData = GetSkillData(SkillId);
    if (!SkillData) return false;

    // Check cooldown
    if (!IsSkillReady(SkillId)) return false;

    // Check realm requirement
    if (UCultivationComponent* Cultivation = GetOwner()->FindComponentByClass<UCultivationComponent>())
    {
        if (Cultivation->GetCurrentRealm() < SkillData->RequiredRealm)
        {
            UE_LOG(LogLongevity, Log, TEXT("Skill %s requires realm %d"), *SkillId.ToString(), SkillData->RequiredRealm);
            return false;
        }
    }

    // Apply damage to target
    if (SkillData->Damage > 0.0f && Target)
    {
        if (UBattleComponent* TargetBattle = Target->FindComponentByClass<UBattleComponent>())
        {
            TargetBattle->TakeDamage(SkillData->Damage, GetOwner());
            OnDamageDealt.Broadcast(Target, SkillData->Damage, SkillId);

            UE_LOG(LogLongevity, Log, TEXT("%s used %s on %s for %.0f damage"),
                *GetOwner()->GetName(), *SkillData->SkillName.ToString(),
                *Target->GetName(), SkillData->Damage);
        }
    }

    // Apply effect (buff/debuff)
    if (SkillData->Effect.EffectType != NAME_None)
    {
        ApplyEffect(SkillData->Effect);
    }

    // Set cooldown
    if (SkillData->Cooldown > 0.0f)
    {
        const float CurrentTime = GetWorld()->GetTimeSeconds();
        SkillCooldowns.Add(SkillId, CurrentTime + SkillData->Cooldown);
    }

    return true;
}

bool UBattleComponent::UseSkillByIndex(int32 SlotIndex)
{
    if (!EquippedSkills.IsValidIndex(SlotIndex)) return false;

    AActor* Target = FindCurrentTarget();
    return UseSkill(EquippedSkills[SlotIndex], Target);
}

void UBattleComponent::TakeDamage(float Amount, AActor* Instigator)
{
    if (!IsAlive() || Amount <= 0.0f) return;

    CurrentHP = FMath::Max(0.0f, CurrentHP - Amount);
    OnDamageTaken.Broadcast(Amount, Instigator);
    OnHealthChanged.Broadcast(GetHealthPercent());

    UE_LOG(LogLongevity, Log, TEXT("%s took %.0f damage (HP: %.0f/%.0f)"),
        *GetOwner()->GetName(), Amount, CurrentHP, MaxHP);

    if (CurrentHP <= 0.0f)
    {
        UE_LOG(LogLongevity, Log, TEXT("%s has been defeated!"), *GetOwner()->GetName());
        OnDeath.Broadcast();
    }
}

void UBattleComponent::Heal(float Amount)
{
    if (!IsAlive() || Amount <= 0.0f) return;

    // Matches JS: this.hp = Math.min(this.hp + amount, this.maxHp)
    CurrentHP = FMath::Min(CurrentHP + Amount, MaxHP);
    OnHealthChanged.Broadcast(GetHealthPercent());
}

bool UBattleComponent::IsSkillReady(FName SkillId) const
{
    const float* CooldownEnd = SkillCooldowns.Find(SkillId);
    if (!CooldownEnd) return true;

    return GetWorld()->GetTimeSeconds() >= *CooldownEnd;
}

float UBattleComponent::GetSkillCooldownRemaining(FName SkillId) const
{
    const float* CooldownEnd = SkillCooldowns.Find(SkillId);
    if (!CooldownEnd) return 0.0f;

    return FMath::Max(0.0f, *CooldownEnd - GetWorld()->GetTimeSeconds());
}

void UBattleComponent::ApplyEffect(const FSkillEffect& Effect)
{
    // Matches JS: applyEffect({ type: 'buff', stat: 'maxHp', value: 100 })
    if (Effect.EffectType == FName("buff"))
    {
        if (Effect.AffectedStat == FName("maxHp"))
        {
            MaxHP += Effect.Value;
            CurrentHP += Effect.Value;
            OnHealthChanged.Broadcast(GetHealthPercent());
            UE_LOG(LogLongevity, Log, TEXT("Buff applied: MaxHP +%.0f"), Effect.Value);
        }
        else if (Effect.AffectedStat == FName("attack"))
        {
            Attack += Effect.Value;
        }
        else if (Effect.AffectedStat == FName("defense"))
        {
            Defense += Effect.Value;
        }
    }
}

const FSkillData* UBattleComponent::GetSkillData(FName SkillId) const
{
    if (!SkillDataTable) return nullptr;
    return SkillDataTable->FindRow<FSkillData>(SkillId, TEXT("GetSkillData"));
}

AActor* UBattleComponent::FindCurrentTarget() const
{
    // Find closest enemy within attack range
    // In full implementation, this would use a targeting system
    // For now, return nullptr (target passed explicitly)
    return nullptr;
}
