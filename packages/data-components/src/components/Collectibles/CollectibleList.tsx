import { type ReactNode, useCallback, useEffect, useState } from "react";
import { Dimensions, FlatList, type ListRenderItem } from "react-native";
import { useMedia, YStack } from "@coral-xyz/tamagui";
import { Platform } from "expo-modules-core";

import type { DataComponentScreenProps } from "../common";

import { CollectibleCard } from "./CollectibleCard";
import type { CollectibleGroup } from "./utils";

export type CollectibleListProps = {
  collectibleGroups: CollectibleGroup[];
  emptyStateComponent?: DataComponentScreenProps["emptyStateComponent"];
  header?: ReactNode;
};

// Placeholder collection name
const placeholder = "placeholder-lads-ftw";

export function CollectibleList({
  collectibleGroups: baseCollectibleGroups,
  emptyStateComponent,
  header,
}: CollectibleListProps) {
  const media = useMedia();
  const imageBoxSize = Platform.select({ native: 165, web: 165 });
  const gap = media.sm ? 16 : media.md ? 20 : 24;
  const [numColumns, setNumColumns] = useState(2);

  // Handles dynamic column count and update
  useEffect(() => {
    const updateColumns = () => {
      const width = Dimensions.get("window").width;
      const columns = Math.floor((width - gap) / (imageBoxSize + gap));
      setNumColumns(Math.max(columns, 2));
    };

    // Subscribe to dimension changes
    const subscription = Dimensions.addEventListener("change", updateColumns);
    updateColumns(); // Initial setup

    return () => {
      subscription.remove();
    };
  }, [gap, imageBoxSize]);

  // Add placeholder items to fill the last row when the number of items is not a multiple of the number of columns
  // Not the proudest implementation, but required to keep the grid layout consistent in flatList, otherwise use a different library or change layouts.
  const lastColumnItems = baseCollectibleGroups.length % numColumns;
  const collectibleGroups =
    baseCollectibleGroups.length % numColumns !== numColumns
      ? [
          ...baseCollectibleGroups,
          ...Array(numColumns - lastColumnItems).fill({
            collection: placeholder,
            data: [],
          }),
        ]
      : baseCollectibleGroups;

  /**
   * Returns the child component key for an item.
   * @param {CollectibleGroup} item
   * @returns {string}
   */
  const keyExtractor = useCallback(
    (item: CollectibleGroup) => item.collection,
    []
  );

  /**
   * Render the child component of the group list.
   * @param {ListRenderItemInfo<CollectibleGroup>} info
   * @returns {ReactElement}
   */
  const renderItem: ListRenderItem<CollectibleGroup> = useCallback(
    ({ item }) => {
      if (item.collection === placeholder)
        return <YStack key={item.collection} style={{ width: imageBoxSize }} />;
      return <CollectibleCard key={item.collection} collectibles={item} />;
    },
    [imageBoxSize]
  );

  return (
    <YStack space="$2" flex={1}>
      {header}
      {collectibleGroups.length === 0 ? (
        emptyStateComponent
      ) : (
        <FlatList
          key={numColumns}
          showsVerticalScrollIndicator={false}
          style={{ marginTop: 16, width: "100%" }}
          contentContainerStyle={{
            gap: 14,
            paddingHorizontal: 16,
            paddingBottom: 16,
            minHeight: "100%",
          }}
          columnWrapperStyle={{ gap, justifyContent: "space-around" }}
          numColumns={numColumns}
          data={collectibleGroups}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
        />
      )}
    </YStack>
  );
}
