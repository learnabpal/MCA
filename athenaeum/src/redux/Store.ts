import { inMemoryContentCollectionReducer, inMemoryContentCollectionSliceName } from "@/core/InMemoryContentCollection";
import { inMemoryExploreReducer, inMemoryExploreSliceName } from "@/core/InMemoryExplore";
import { inMemoryHostSliceName, inMemoryHostSliceReducer } from "@/core/InMemoryHost";
import { configureStore } from "@reduxjs/toolkit";




const store = configureStore({
	  reducer: {
			 [inMemoryHostSliceName]: inMemoryHostSliceReducer,
			 [inMemoryExploreSliceName]: inMemoryExploreReducer,
			 [inMemoryContentCollectionSliceName]: inMemoryContentCollectionReducer
	  }
	  // middleware: middlewareForAllowingNonSerializableObjects
});

export default store;

// export const persistedStore = persistStore(store);
