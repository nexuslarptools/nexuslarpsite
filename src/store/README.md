# Zustand State Management

This directory contains the Zustand state management stores for the NEXUS LARP site. Zustand is a small, fast, and scalable state management solution that uses hooks for consuming state.

## Available Stores

### UI Store (`uiStore.js`)

Manages UI-related state such as drawer open/close and navigation.

```jsx
import { useUIStore } from '../store';

// In your component
const MyComponent = () => {
  // Select only what you need
  const isDrawerOpen = useUIStore((state) => state.isDrawerOpen);
  const toggleDrawer = useUIStore((state) => state.toggleDrawer);
  
  return (
    <button onClick={() => toggleDrawer(!isDrawerOpen)}>
      {isDrawerOpen ? 'Close' : 'Open'} Drawer
    </button>
  );
};
```

### Characters Store (`charactersStore.js`)

Manages character-related state such as filters, view options, and character selection.

```jsx
import { useCharactersStore } from '../store';

// In your component
const CharacterComponent = () => {
  // Select only what you need
  const filter = useCharactersStore((state) => state.filter);
  const setFilter = useCharactersStore((state) => state.setFilter);
  const viewCharacter = useCharactersStore((state) => state.viewCharacter);
  
  return (
    <div>
      <input 
        value={filter.CharacterFilter} 
        onChange={(e) => setFilter({ CharacterFilter: e.target.value })} 
      />
      <button onClick={() => viewCharacter('guid123', 'path/to/character')}>
        View Character
      </button>
    </div>
  );
};
```

### Items Store (`itemsStore.js`)

Manages item-related state such as filters, view options, and item selection.

```jsx
import { useItemsStore } from '../store';

// In your component
const ItemComponent = () => {
  // Select only what you need
  const filter = useItemsStore((state) => state.filter);
  const setFilter = useItemsStore((state) => state.setFilter);
  const viewItem = useItemsStore((state) => state.viewItem);
  
  return (
    <div>
      <input 
        value={filter.ItemsFilter} 
        onChange={(e) => setFilter({ ItemsFilter: e.target.value })} 
      />
      <button onClick={() => viewItem('guid123', 'path/to/item')}>
        View Item
      </button>
    </div>
  );
};
```

## Best Practices

1. **Select only what you need**: Only select the specific state and actions you need in your component to prevent unnecessary re-renders.

2. **Use multiple selectors**: Split your selectors to minimize re-renders. Components will only re-render when the selected state changes.

3. **Use actions for state changes**: Always use the provided actions to change state rather than trying to modify state directly.

4. **Combine with React Query**: For server state, continue using React Query. Zustand is for client-side state only.

## Migration Guide

When migrating existing components to use Zustand:

1. Import the appropriate store(s) from the store directory
2. Replace props with store selectors
3. Replace prop callbacks with store actions
4. Remove unnecessary prop drilling