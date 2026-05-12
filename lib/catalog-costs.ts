type InventoryItemRow = {
  id: string;
  name: string;
  unit_cost: number | string;
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

function toNumber(value: number | string | null | undefined) {
  const parsed = typeof value === "number" ? value : Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function matchInventoryItem(
  inventoryItems: InventoryItemRow[],
  candidates: Array<string | null | undefined>,
) {
  const normalizedCandidates = candidates
    .filter((candidate): candidate is string => Boolean(candidate))
    .map(normalize);

  return inventoryItems.find((item) => {
    const itemName = normalize(item.name);
    return normalizedCandidates.some(
      (candidate) =>
        candidate === itemName ||
        itemName.includes(candidate) ||
        candidate.includes(itemName),
    );
  });
}

export function suggestConfiguredCost({
  inventoryItems,
  candidates,
  usageQuantity = 1,
  fallbackCost = 0,
}: {
  inventoryItems: InventoryItemRow[];
  candidates: Array<string | null | undefined>;
  usageQuantity?: number;
  fallbackCost?: number;
}) {
  const matchedItem = matchInventoryItem(inventoryItems, candidates);

  if (!matchedItem) {
    return {
      inventoryItemId: null,
      cost: fallbackCost,
    };
  }

  return {
    inventoryItemId: matchedItem.id,
    cost: Math.round(toNumber(matchedItem.unit_cost) * usageQuantity),
  };
}
