import React from 'react';
import {
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
  Image as ImageIcon,
  Description as WordIcon,
  InsertDriveFile as FileIcon,
  VideoFile as VideoIcon,
  AudioFile as AudioIcon,
  Code as CodeIcon,
  Archive as ArchiveIcon,
} from '@mui/icons-material';
import { SvgIconProps } from '@mui/material/SvgIcon';

export const getFileIcon = (fileType: string, props?: SvgIconProps): React.ReactElement => {
  const type = fileType.toLowerCase();
  
  if (type.includes('pdf')) {
    return <PdfIcon {...props} sx={{ color: '#DC143C', ...props?.sx }} />;
  }
  if (type.includes('excel') || type.includes('spreadsheet') || type.includes('xls') || type.includes('xlsx')) {
    return <ExcelIcon {...props} sx={{ color: '#217346', ...props?.sx }} />;
  }
  if (type.includes('image') || type.includes('jpg') || type.includes('jpeg') || type.includes('png') || type.includes('gif') || type.includes('bmp') || type.includes('svg')) {
    return <ImageIcon {...props} sx={{ color: '#4CAF50', ...props?.sx }} />;
  }
  if (type.includes('word') || type.includes('doc') || type.includes('docx')) {
    return <WordIcon {...props} sx={{ color: '#2B579A', ...props?.sx }} />;
  }
  if (type.includes('video') || type.includes('mp4') || type.includes('avi') || type.includes('mov') || type.includes('mkv')) {
    return <VideoIcon {...props} sx={{ color: '#FF6B6B', ...props?.sx }} />;
  }
  if (type.includes('audio') || type.includes('mp3') || type.includes('wav') || type.includes('flac')) {
    return <AudioIcon {...props} sx={{ color: '#9C27B0', ...props?.sx }} />;
  }
  if (type.includes('zip') || type.includes('rar') || type.includes('7z') || type.includes('tar') || type.includes('gz')) {
    return <ArchiveIcon {...props} sx={{ color: '#FF9800', ...props?.sx }} />;
  }
  if (type.includes('code') || type.includes('js') || type.includes('ts') || type.includes('java') || type.includes('py') || type.includes('cpp') || type.includes('html') || type.includes('css')) {
    return <CodeIcon {...props} sx={{ color: '#607D8B', ...props?.sx }} />;
  }
  
  return <FileIcon {...props} sx={{ color: '#757575', ...props?.sx }} />;
};

