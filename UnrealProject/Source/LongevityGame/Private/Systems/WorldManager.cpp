#include "Systems/WorldManager.h"
#include "LongevityGame.h"

AWorldManager::AWorldManager()
{
    PrimaryActorTick.bCanEverTick = false;
}

void AWorldManager::BeginPlay()
{
    Super::BeginPlay();

    if (RegionDataTable)
    {
        LoadRegionsFromDataTable();
    }
    else if (Regions.Num() == 0)
    {
        InitializeDefaultRegions();
    }

    UE_LOG(LogLongevity, Log, TEXT("WorldManager initialized with %d regions"), Regions.Num());
}

FWorldRegionData AWorldManager::GetCurrentRegion(FVector PlayerLocation) const
{
    for (const FWorldRegionData& Region : Regions)
    {
        const float MinX = Region.WorldPosition.X;
        const float MinY = Region.WorldPosition.Y;
        const float MaxX = MinX + Region.RegionSize.X;
        const float MaxY = MinY + Region.RegionSize.Y;

        if (PlayerLocation.X >= MinX && PlayerLocation.X < MaxX &&
            PlayerLocation.Y >= MinY && PlayerLocation.Y < MaxY)
        {
            return Region;
        }
    }

    // Return first region as fallback
    if (Regions.Num() > 0)
    {
        return Regions[0];
    }

    return FWorldRegionData();
}

void AWorldManager::LoadRegionsFromDataTable()
{
    if (!RegionDataTable) return;

    Regions.Empty();
    TArray<FWorldRegionData*> AllRows;
    RegionDataTable->GetAllRows<FWorldRegionData>(TEXT("LoadRegions"), AllRows);

    for (const FWorldRegionData* Row : AllRows)
    {
        Regions.Add(*Row);
    }
}

void AWorldManager::InitializeDefaultRegions()
{
    // Matches WorldData.js WORLD_CONFIG.regions
    // Scaled from pixel space (800px regions) to UE5 world units (200000cm = 2km per region)

    FWorldRegionData Chongxu;
    Chongxu.RegionId = FName("chongxu");
    Chongxu.RegionName = FText::FromString(TEXT("终南山·清虚观"));
    Chongxu.Description = FText::FromString(TEXT("李长寿修行的山门，仙气缭绕，道法昌盛"));
    Chongxu.WorldPosition = FVector2D(0.0f, 0.0f);
    Chongxu.RegionSize = FVector2D(200000.0f, 200000.0f);
    Regions.Add(Chongxu);

    FWorldRegionData Donghai;
    Donghai.RegionId = FName("donghai");
    Donghai.RegionName = FText::FromString(TEXT("东海之滨"));
    Donghai.Description = FText::FromString(TEXT("碧波万顷，仙岛林立"));
    Donghai.WorldPosition = FVector2D(200000.0f, 0.0f);
    Donghai.RegionSize = FVector2D(200000.0f, 200000.0f);
    Regions.Add(Donghai);

    FWorldRegionData Kunlun;
    Kunlun.RegionId = FName("kunlun");
    Kunlun.RegionName = FText::FromString(TEXT("昆仑山"));
    Kunlun.Description = FText::FromString(TEXT("万山之祖，仙气浓郁"));
    Kunlun.WorldPosition = FVector2D(0.0f, 200000.0f);
    Kunlun.RegionSize = FVector2D(200000.0f, 200000.0f);
    Regions.Add(Kunlun);

    FWorldRegionData Huoyun;
    Huoyun.RegionId = FName("huoyun");
    Huoyun.RegionName = FText::FromString(TEXT("火云洞"));
    Huoyun.Description = FText::FromString(TEXT("三皇居所，威严神圣"));
    Huoyun.WorldPosition = FVector2D(200000.0f, 200000.0f);
    Huoyun.RegionSize = FVector2D(200000.0f, 200000.0f);
    Regions.Add(Huoyun);
}
