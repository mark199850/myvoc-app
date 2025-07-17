import { useState, useCallback } from 'react';

export function useExpansionState(initialState: string[] = []) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(initialState));

  const toggleItem = useCallback((itemId: string) => {
    setExpandedItems(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(itemId)) {
        newExpanded.delete(itemId);
      } else {
        newExpanded.add(itemId);
      }
      return newExpanded;
    });
  }, []);

  const expandItem = useCallback((itemId: string) => {
    setExpandedItems(prev => new Set(prev).add(itemId));
  }, []);

  const collapseItem = useCallback((itemId: string) => {
    setExpandedItems(prev => {
      const newExpanded = new Set(prev);
      newExpanded.delete(itemId);
      return newExpanded;
    });
  }, []);

  const isExpanded = useCallback((itemId: string) => {
    return expandedItems.has(itemId);
  }, [expandedItems]);

  const expandAll = useCallback((itemIds: string[]) => {
    setExpandedItems(new Set(itemIds));
  }, []);

  const collapseAll = useCallback(() => {
    setExpandedItems(new Set());
  }, []);

  return {
    expandedItems,
    isExpanded,
    toggleItem,
    expandItem,
    collapseItem,
    expandAll,
    collapseAll,
  };
}