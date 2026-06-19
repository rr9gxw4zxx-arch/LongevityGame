#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "Data/LongevityDataTypes.h"
#include "WorldManager.generated.h"

/**
 * Manages world regions and level streaming.
 * Maps from: MapSystem.js (regions, tile generation, collision)
 *
 * In UE5, terrain is handled by Landscape + World Partition rather than
 * procedural tiles. This actor manages region metadata and transitions.
 */
UCLASS()
class LONGEVITYGAME_API AWorldManager : public AActor
{
    GENERATED_BODY()

public:
    AWorldManager();

    /** Get the region the player is currently in */
    UFUNCTION(BlueprintCallable, Category = "World")
    FWorldRegionData GetCurrentRegion(FVector PlayerLocation) const;

    /** Get all world regions */
    UFUNCTION(BlueprintPure, Category = "World")
    const TArray<FWorldRegionData>& GetAllRegions() const { return Regions; }

    /** Total world size (4km x 4km) */
    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "World")
    FVector2D WorldSize = FVector2D(400000.0f, 400000.0f); // 4000m in cm

protected:
    virtual void BeginPlay() override;

    /** Region definitions (can be loaded from DataTable or set in editor) */
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "World")
    TArray<FWorldRegionData> Regions;

    /** DataTable for region data */
    UPROPERTY(EditDefaultsOnly, Category = "World")
    TObjectPtr<UDataTable> RegionDataTable;

private:
    void LoadRegionsFromDataTable();
    void InitializeDefaultRegions();
};
