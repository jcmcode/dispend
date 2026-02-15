import { ipcMain, dialog } from 'electron';
import { IPC_CHANNELS } from '../../shared/constants/channels';
import path from 'path';

export function registerImportHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.IMPORT_OPEN_FILE, async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: 'Statements', extensions: ['csv', 'pdf'] },
        { name: 'CSV Files', extensions: ['csv'] },
        { name: 'PDF Files', extensions: ['pdf'] },
      ],
    });

    if (result.canceled || result.filePaths.length === 0) {
      return null;
    }

    const filePath = result.filePaths[0];
    const ext = path.extname(filePath).toLowerCase().slice(1);

    return { filePath, fileType: ext };
  });

  // Parse, Execute, Undo, and ListBatches handlers will be added in Phase 2
  ipcMain.handle(IPC_CHANNELS.IMPORT_PARSE, async () => {
    return { fileName: '', fileType: 'csv', transactions: [], duplicateCount: 0 };
  });

  ipcMain.handle(IPC_CHANNELS.IMPORT_EXECUTE, async () => {
    return { batchId: '', imported: 0, duplicatesSkipped: 0 };
  });

  ipcMain.handle(IPC_CHANNELS.IMPORT_UNDO, async () => {});

  ipcMain.handle(IPC_CHANNELS.IMPORT_BATCHES, async () => {
    return [];
  });
}
