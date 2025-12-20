import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Typography,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse,
    CircularProgress,
    Breadcrumbs,
    Link,
    Chip,
    useTheme,
    alpha,
} from '@mui/material';
import {
    Folder as FolderIcon,
    FolderOpen as FolderOpenIcon,
    ExpandMore,
    ChevronRight,
    Home as HomeIcon,
} from '@mui/icons-material';
import { Folder } from '../../types/folder';
import { folderApi } from '../../api/folderApi';

interface FolderTreeSelectorProps {
    selectedFolderId: number | null;
    onSelect: (folderId: number | null, folderPath: Folder[]) => void;
}

interface FolderNodeProps {
    folder: Folder;
    level: number;
    selectedId: number | null;
    onSelect: (folder: Folder) => void;
    expandedIds: Set<number>;
    onToggleExpand: (folderId: number) => void;
    loadSubFolders: (folderId: number) => Promise<Folder[]>;
    subFoldersCache: Map<number, Folder[]>;
}

const FolderNode: React.FC<FolderNodeProps> = ({
    folder,
    level,
    selectedId,
    onSelect,
    expandedIds,
    onToggleExpand,
    loadSubFolders,
    subFoldersCache,
}) => {
    const theme = useTheme();
    const [subFolders, setSubFolders] = useState<Folder[]>([]);
    const [loading, setLoading] = useState(false);
    const isExpanded = expandedIds.has(folder.id);
    const isSelected = selectedId === folder.id;

    useEffect(() => {
        if (isExpanded && !subFoldersCache.has(folder.id)) {
            setLoading(true);
            loadSubFolders(folder.id).then((folders) => {
                setSubFolders(folders);
                setLoading(false);
            });
        } else if (subFoldersCache.has(folder.id)) {
            setSubFolders(subFoldersCache.get(folder.id) || []);
        }
    }, [isExpanded, folder.id, loadSubFolders, subFoldersCache]);

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleExpand(folder.id);
    };

    const handleSelect = () => {
        onSelect(folder);
    };

    return (
        <>
            <ListItemButton
                onClick={handleSelect}
                sx={{
                    pl: 2 + level * 2,
                    py: 0.75,
                    borderRadius: 1,
                    mb: 0.5,
                    backgroundColor: isSelected ? alpha(theme.palette.primary.main, 0.12) : 'transparent',
                    border: isSelected ? `1px solid ${theme.palette.primary.main}` : '1px solid transparent',
                    '&:hover': {
                        backgroundColor: isSelected
                            ? alpha(theme.palette.primary.main, 0.16)
                            : alpha(theme.palette.action.hover, 0.08),
                    },
                }}
            >
                <ListItemIcon sx={{ minWidth: 32, cursor: 'pointer' }} onClick={handleToggle}>
                    {loading ? (
                        <CircularProgress size={16} />
                    ) : isExpanded ? (
                        <ExpandMore fontSize="small" />
                    ) : (
                        <ChevronRight fontSize="small" />
                    )}
                </ListItemIcon>
                <ListItemIcon sx={{ minWidth: 32 }}>
                    {isExpanded ? (
                        <FolderOpenIcon sx={{ color: theme.palette.warning.main }} />
                    ) : (
                        <FolderIcon sx={{ color: theme.palette.warning.light }} />
                    )}
                </ListItemIcon>
                <ListItemText
                    primary={folder.folderName}
                    primaryTypographyProps={{
                        variant: 'body2',
                        fontWeight: isSelected ? 600 : 400,
                    }}
                />
            </ListItemButton>
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {subFolders.map((subFolder) => (
                        <FolderNode
                            key={subFolder.id}
                            folder={subFolder}
                            level={level + 1}
                            selectedId={selectedId}
                            onSelect={onSelect}
                            expandedIds={expandedIds}
                            onToggleExpand={onToggleExpand}
                            loadSubFolders={loadSubFolders}
                            subFoldersCache={subFoldersCache}
                        />
                    ))}
                </List>
            </Collapse>
        </>
    );
};

export const FolderTreeSelector: React.FC<FolderTreeSelectorProps> = ({
    selectedFolderId,
    onSelect,
}) => {
    const theme = useTheme();
    const [rootFolders, setRootFolders] = useState<Folder[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
    const [folderPath, setFolderPath] = useState<Folder[]>([]);
    const [subFoldersCache] = useState<Map<number, Folder[]>>(new Map());

    useEffect(() => {
        const loadRootFolders = async () => {
            setLoading(true);
            try {
                const folders = await folderApi.getRootFolders();
                setRootFolders(folders);
            } catch (error) {
                console.error('Error loading root folders:', error);
            }
            setLoading(false);
        };
        loadRootFolders();
    }, []);

    const loadSubFolders = useCallback(async (folderId: number): Promise<Folder[]> => {
        if (subFoldersCache.has(folderId)) {
            return subFoldersCache.get(folderId) || [];
        }
        const folders = await folderApi.getSubFolders(folderId);
        subFoldersCache.set(folderId, folders);
        return folders;
    }, [subFoldersCache]);

    const handleToggleExpand = (folderId: number) => {
        setExpandedIds((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(folderId)) {
                newSet.delete(folderId);
            } else {
                newSet.add(folderId);
            }
            return newSet;
        });
    };

    const buildPath = useCallback(async (folder: Folder): Promise<Folder[]> => {
        const path: Folder[] = [folder];
        let current = folder;
        while (current.parentFolder) {
            path.unshift(current.parentFolder);
            current = current.parentFolder;
        }
        return path;
    }, []);

    const handleSelectFolder = async (folder: Folder) => {
        const path = await buildPath(folder);
        setFolderPath(path);
        // Expand all ancestors
        path.forEach((f) => {
            setExpandedIds((prev) => new Set(prev).add(f.id));
        });
        onSelect(folder.id, path);
    };

    const handleSelectRoot = () => {
        setFolderPath([]);
        onSelect(null, []);
    };

    const handleBreadcrumbClick = (folder: Folder, index: number) => {
        const newPath = folderPath.slice(0, index + 1);
        setFolderPath(newPath);
        onSelect(folder.id, newPath);
    };

    return (
        <Box>
            {/* Breadcrumbs */}
            <Box sx={{ mb: 2, p: 1.5, bgcolor: alpha(theme.palette.primary.main, 0.04), borderRadius: 2 }}>
                <Breadcrumbs separator="›" aria-label="folder breadcrumb">
                    <Link
                        component="button"
                        underline="hover"
                        color={folderPath.length === 0 ? 'primary' : 'inherit'}
                        onClick={handleSelectRoot}
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}
                    >
                        <HomeIcon fontSize="small" />
                        Root
                    </Link>
                    {folderPath.map((folder, index) => (
                        <Link
                            key={folder.id}
                            component="button"
                            underline="hover"
                            color={index === folderPath.length - 1 ? 'primary' : 'inherit'}
                            onClick={() => handleBreadcrumbClick(folder, index)}
                            sx={{ cursor: 'pointer' }}
                        >
                            {folder.folderName}
                        </Link>
                    ))}
                </Breadcrumbs>
            </Box>

            {/* Selected folder chip */}
            {selectedFolderId !== null && folderPath.length > 0 && (
                <Chip
                    icon={<FolderIcon />}
                    label={`Selected: ${folderPath[folderPath.length - 1]?.folderName || 'Unknown'}`}
                    color="primary"
                    size="small"
                    sx={{ mb: 2 }}
                />
            )}

            {/* Folder Tree */}
            <Box
                sx={{
                    maxHeight: 250,
                    overflowY: 'auto',
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    p: 1,
                }}
            >
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress size={24} />
                    </Box>
                ) : rootFolders.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                        No folders available. Files will be uploaded to root.
                    </Typography>
                ) : (
                    <List component="nav" dense>
                        {/* Root option */}
                        <ListItemButton
                            onClick={handleSelectRoot}
                            sx={{
                                borderRadius: 1,
                                mb: 0.5,
                                backgroundColor:
                                    selectedFolderId === null ? alpha(theme.palette.primary.main, 0.12) : 'transparent',
                                border:
                                    selectedFolderId === null
                                        ? `1px solid ${theme.palette.primary.main}`
                                        : '1px solid transparent',
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 32 }}>
                                <HomeIcon sx={{ color: theme.palette.info.main }} />
                            </ListItemIcon>
                            <ListItemText
                                primary="Root (No Folder)"
                                primaryTypographyProps={{
                                    variant: 'body2',
                                    fontWeight: selectedFolderId === null ? 600 : 400,
                                }}
                            />
                        </ListItemButton>

                        {rootFolders.map((folder) => (
                            <FolderNode
                                key={folder.id}
                                folder={folder}
                                level={0}
                                selectedId={selectedFolderId}
                                onSelect={handleSelectFolder}
                                expandedIds={expandedIds}
                                onToggleExpand={handleToggleExpand}
                                loadSubFolders={loadSubFolders}
                                subFoldersCache={subFoldersCache}
                            />
                        ))}
                    </List>
                )}
            </Box>
        </Box>
    );
};

export default FolderTreeSelector;
