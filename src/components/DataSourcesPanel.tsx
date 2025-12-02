import { RoomPanel, useBaseRoomStore } from "@sqlrooms/room-shell";
import { TableStructurePanel } from "@sqlrooms/sql-editor";
import { FileDropzone } from "@sqlrooms/dropzone";
import { RoomPanelTypes, RoomState } from "../store";
import { convertToValidColumnOrTableName } from "@sqlrooms/utils";
import { useToast } from "@sqlrooms/ui";

export const DataSourcesPanel = () => {
  const connector = useBaseRoomStore<RoomState, RoomState['db']['connector']>((state) => state.db.connector);
  const refreshTableSchemas = useBaseRoomStore<RoomState, RoomState['db']['refreshTableSchemas']>((state) => state.db.refreshTableSchemas);
  const { toast } = useToast();

  return (
    <RoomPanel type={RoomPanelTypes.enum["data-sources"]}>
      <FileDropzone
        className="h-[200px] p-5"
        acceptedFormats={{
          "text/csv": [".csv"],
          "text/tsv": [".tsv"],
          "text/parquet": [".parquet"],
          "text/json": [".json"],
        }}
        onDrop={async (files) => {
          for (const file of files) {
            try {
              const tableName = convertToValidColumnOrTableName(file.name);
              await connector.loadFile(file, tableName);
              toast({
                variant: "default",
                title: "Table created",
                description: `File ${file.name} loaded as ${tableName}`,
              });
            } catch (error) {
              toast({
                variant: "destructive",
                title: "Error",
                description: `Error loading file ${file.name}: ${error}`,
              });
            }
          }
          await refreshTableSchemas();
        }}
      >
        <div className="text-muted-foreground text-xs">Files you add will stay local to your browser.</div>
      </FileDropzone>
      <TableStructurePanel />
    </RoomPanel>
  );
};
