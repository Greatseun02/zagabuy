import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

const fileSlice = createSlice({
  name: "file",
  initialState: {
    progress: 0,
  },
  reducers: {
    setProgress: (state, action: PayloadAction<number>) => {
      state.progress = action.payload;
    },
    resetProgress: (state) => {
      state.progress = 0;
    },
  },
});

interface S3UploadArgs {
  file: File;
  uploadUrl: string;
  blobUrl: string;
}

const action = {
  uploadFile: createAsyncThunk<{ url: string }, S3UploadArgs>(
    "s3/uploadToS3",
    async ({ file, uploadUrl, blobUrl }, thunkAPI) => {
      return new Promise<{ url: string }>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadUrl);

        // Optional: track progress
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100;
            // You can dispatch progress to slice here if needed
            thunkAPI.dispatch(fileSlice.actions.setProgress(progress));
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve({ url: blobUrl });
          } else {
            reject(new Error("S3 Upload Failed"));
          }
        };

        xhr.onerror = () => reject(new Error("Network error"));

        xhr.send(file);
      });
    }
  ),
};

export const fileStore = {
  mutation: fileSlice.actions,
  action,
  reducer: fileSlice.reducer,
};
