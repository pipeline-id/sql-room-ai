import {
  AiSettingsSliceState,
  AiSliceConfig,
  AiSliceState,
  createAiSettingsSlice,
  createAiSlice,
  createDefaultAiInstructions,
  createDefaultAiTools,
} from "@sqlrooms/ai";
import {
  BaseRoomConfig,
  createPersistHelpers,
  createRoomShellSlice,
  createRoomStore,
  LayoutConfig,
  LayoutTypes,
  MAIN_VIEW,
  RoomShellSliceState,
  StateCreator,
} from "@sqlrooms/room-shell";
import {
  createSqlEditorSlice,
  SqlEditorSliceConfig,
  SqlEditorSliceState,
} from "@sqlrooms/sql-editor";
import { createVegaChartTool } from "@sqlrooms/vega";
import { DatabaseIcon } from "lucide-react";
import { z } from "zod";
import { persist } from "zustand/middleware";
import { DataSourcesPanel } from "./components/DataSourcesPanel";
import { MainView } from "./components/MainView";
import { createAiSettings, ApiKeys } from "./config";
import { createWasmMotherDuckDbConnector } from "@sqlrooms/motherduck";

export const RoomPanelTypes = z.enum([
  "room-details",
  "data-sources",
  "view-configuration",
  MAIN_VIEW,
] as const);
export type RoomPanelTypes = z.infer<typeof RoomPanelTypes>;

export type RoomState = RoomShellSliceState &
  AiSliceState &
  SqlEditorSliceState &
  AiSettingsSliceState;

/**
 * Create a customized room store with the provided MotherDuck token and API keys
 */
export const createRoomStoreWithToken = (
  mdToken: string,
  apiKeys: ApiKeys = {}
) =>
  createRoomStore<RoomState>(
    persist(
      (set, get, store) => ({
        // Base room slice
        ...createRoomShellSlice({
          connector: createWasmMotherDuckDbConnector({
            mdToken,
          }),
          layout: {
            config: {
              type: LayoutTypes.enum.mosaic,
              nodes: {
                direction: "row",
                first: RoomPanelTypes.enum["data-sources"],
                second: MAIN_VIEW,
                splitPercentage: 30,
              },
            },
            panels: {
              [RoomPanelTypes.enum["data-sources"]]: {
                title: "Data Sources",
                icon: DatabaseIcon,
                component: DataSourcesPanel,
                placement: "sidebar",
              },
              main: {
                title: "Main view",
                icon: () => null,
                component: MainView,
                placement: "main",
              },
            },
          },
        })(set, get, store),

        // ...createDuckDbSlice()(set, get, store),

        // ...createLayoutSlice({
        //   config: {
        //     type: LayoutTypes.enum.mosaic,
        //     nodes: {
        //       direction: 'row',
        //       first: RoomPanelTypes.enum['data-sources'],
        //       second: MAIN_VIEW,
        //       splitPercentage: 30,
        //     },
        //   },
        //   panels: {
        //     [RoomPanelTypes.enum['data-sources']]: {
        //       title: 'Data Sources',
        //       icon: DatabaseIcon,
        //       component: DataSourcesPanel,
        //       placement: 'sidebar',
        //     },
        //     main: {
        //       title: 'Main view',
        //       icon: () => null,
        //       component: MainView,
        //       placement: 'main',
        //     },
        //   },
        // })(set, get, store),

        // Sql editor slice
        ...createSqlEditorSlice()(set, get, store),

        // Ai model config slice
        ...createAiSettingsSlice({ config: createAiSettings(apiKeys) })(
          set,
          get,
          store
        ),

        // Ai slice
        ...createAiSlice({
          getInstructions: () => {
            return createDefaultAiInstructions(store);
          },

          // Add custom tools
          tools: {
            ...createDefaultAiTools(store, { query: {} }),

            // Add the VegaChart tool from the vega package with a custom description
            chart: createVegaChartTool(),
          },
        })(set, get, store),
      }),

      // Persist settings
      {
        // Local storage key
        name: "ai-example-app-state-storage",
        // Helper to extract and merge slice configs
        // Note: aiSettings is excluded from persistence since API keys come from the login form
        ...createPersistHelpers({
          room: BaseRoomConfig,
          layout: LayoutConfig,
          ai: AiSliceConfig,
          sqlEditor: SqlEditorSliceConfig,
        }),
      }
    ) as StateCreator<RoomState>
  );
