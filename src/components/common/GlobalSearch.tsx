import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Box,
  Divider,
  InputAdornment,
  Tabs,
  Tab,
  Stack,
  Pagination as MuiPagination
} from '@mui/material';
import { Search as SearchIcon, Folder as FolderIcon, Person as PersonIcon, InsertDriveFile as FileIcon, LocationOn as LocationIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { searchApi } from '../../api/searchApi';
import { ROUTES } from '../../utils/constants';

interface GlobalSearchProps {
  open: boolean;
  onClose: () => void;
}

type Category = 'all' | 'files' | 'folders' | 'people' | 'locations';

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ open, onClose }) => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<Category>('all');
  const [page, setPage] = useState(1);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // Reset page when tab or query changes
  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }

    const searchTimeout = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchApi.search(query, activeTab, page - 1, 10);
        setResults(data);
        if (activeTab !== 'all' && data) {
          setTotalPages(data.totalPages);
        }
      } catch (error) {
        console.error('Search error:', error);
        setResults(null);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query, activeTab, page]);

  const handleItemClick = (type: string, id: number) => {
    switch (type) {
      case 'files':
        navigate(`/files/${id}`);
        break;
      case 'folders':
        navigate(`/folders/${id}`);
        break;
      case 'users':
      case 'people':
        navigate(`/users`); // Currently users page is a list, can't deep link easily without search param
        break;
      case 'locations':
        navigate(`/locations`);
        break;
      default:
        navigate(ROUTES.DASHBOARD);
    }
    onClose();
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: Category) => {
    setActiveTab(newValue);
  };

  const renderFileItem = (file: any) => (
    <ListItem key={file.id} button onClick={() => handleItemClick('files', file.id)}>
      <ListItemIcon><FileIcon /></ListItemIcon>
      <ListItemText primary={file.fileName} secondary={file.fileType} />
    </ListItem>
  );

  const renderFolderItem = (folder: any) => (
    <ListItem key={folder.id} button onClick={() => handleItemClick('folders', folder.id)}>
      <ListItemIcon><FolderIcon /></ListItemIcon>
      <ListItemText primary={folder.folderName} secondary={folder.description} />
    </ListItem>
  );

  const renderUserItem = (user: any) => (
    <ListItem key={user.id} button onClick={() => handleItemClick('users', user.id)}>
      <ListItemIcon><PersonIcon /></ListItemIcon>
      <ListItemText primary={`${user.firstName} ${user.lastName}`} secondary={user.email} />
    </ListItem>
  );

  const renderLocationItem = (location: any) => (
    <ListItem key={location.id} button onClick={() => handleItemClick('locations', location.id)}>
      <ListItemIcon><LocationIcon /></ListItemIcon>
      <ListItemText primary={location.name} secondary={location.type} />
    </ListItem>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { mt: 8, height: '80vh', display: 'flex', flexDirection: 'column' } }}>
      <Box p={2} borderBottom={1} borderColor="divider">
        <TextField
          inputRef={inputRef}
          fullWidth
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
          }}
          autoFocus
        />
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mt: 1 }}>
          <Tab label="All" value="all" />
          <Tab label="Files" value="files" />
          <Tab label="Folders" value="folders" />
          <Tab label="People" value="people" />
          <Tab label="Locations" value="locations" />
        </Tabs>
      </Box>

      <Box flex={1} overflow="auto" p={2}>
        {loading && (
          <Box textAlign="center" py={4}>
            <Typography color="text.secondary">Searching...</Typography>
          </Box>
        )}

        {!loading && query && results && (
          <>
            {activeTab === 'all' ? (
              <List>
                {/* Files Section included in summary */}
                {results.files?.length > 0 && (
                  <>
                    <Typography variant="subtitle2" fontWeight="bold" px={2} py={1}>Files</Typography>
                    {results.files.map(renderFileItem)}
                    <Divider sx={{ my: 1 }} />
                  </>
                )}
                {/* Folders Section */}
                {results.folders?.length > 0 && (
                  <>
                    <Typography variant="subtitle2" fontWeight="bold" px={2} py={1}>Folders</Typography>
                    {results.folders.map(renderFolderItem)}
                    <Divider sx={{ my: 1 }} />
                  </>
                )}
                {/* Users Section */}
                {results.users?.length > 0 && (
                  <>
                    <Typography variant="subtitle2" fontWeight="bold" px={2} py={1}>People</Typography>
                    {results.users.map(renderUserItem)}
                    <Divider sx={{ my: 1 }} />
                  </>
                )}
                {/* Locations Section */}
                {results.locations?.length > 0 && (
                  <>
                    <Typography variant="subtitle2" fontWeight="bold" px={2} py={1}>Locations</Typography>
                    {results.locations.map(renderLocationItem)}
                  </>
                )}
                {/* Empty State for All */}
                {(!results.files?.length && !results.folders?.length && !results.users?.length && !results.locations?.length) && (
                  <Box textAlign="center" py={4}><Typography color="text.secondary">No results found.</Typography></Box>
                )}
              </List>
            ) : (
              // Specific Category View
              <Box>
                <List>
                  {results.content?.map((item: any) => {
                    if (activeTab === 'files') return renderFileItem(item);
                    if (activeTab === 'folders') return renderFolderItem(item);
                    if (activeTab === 'people') return renderUserItem(item);
                    if (activeTab === 'locations') return renderLocationItem(item);
                    return null;
                  })}
                </List>
                {results.content?.length === 0 && (
                  <Box textAlign="center" py={4}><Typography color="text.secondary">No results found in {activeTab}.</Typography></Box>
                )}
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <Stack alignItems="center" py={2}>
                    <MuiPagination
                      count={totalPages}
                      page={page}
                      onChange={(_, p) => setPage(p)}
                      color="primary"
                    />
                  </Stack>
                )}
              </Box>
            )}
          </>
        )}
      </Box>
    </Dialog>
  );
};

