import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import {

  Search as SearchIcon,
  Person as PersonIcon,
  ArrowForward as ArrowForwardIcon,
  Close as CloseIcon,
  Folder as FolderIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { folderApi } from '../api/folderApi';
import { fileApi } from '../api/fileApi';
import { FileUploadModal } from '../components/common/FileUploadModal';

interface Student {
  id: string;
  studentId: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  year: string;
  documentCount: number;
  folderId?: number; // Add folderId to track the folder ID for uploads
}

const DEPARTMENTS = [
  'Computer Science',
  'Business Administration',
  'Engineering',
  'Medicine',
  'Arts',
  'Law',
];

const DOCUMENT_TYPES = [
  'All Document Types',
  'Registration',
  'Financial',
  'Academic',
  'Disciplinary',
];

const YEARS = ['2020', '2021', '2022', '2023', '2024', '2025'];

export const StudentRecordsPage: React.FC = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedDocType, setSelectedDocType] = useState('All Document Types');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [selectedStudentName, setSelectedStudentName] = useState<string>('');
  // const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // Form state
  const [formData, setFormData] = useState({
    studentId: '',
    fullName: '',
    email: '',
    phone: '',
    department: '',
    year: '2024',
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, searchTerm, selectedDepartment, selectedDocType]);

  const fetchStudents = async () => {
    try {
      // setLoading(true);
      const foldersResponse = await folderApi.getAll();
      // Ensure folders is an array
      const folders: any[] = Array.isArray(foldersResponse) ? foldersResponse : [];

      console.log('Fetched folders:', folders);
      console.log('Total folders:', folders.length);

      if (!Array.isArray(foldersResponse)) {
        console.warn('foldersApi.getAll() did not return an array in fetchStudents:', foldersResponse);
      }

      // Find Student Records folder - check both with and without parentFolder
      const studentRecordsFolder = folders.find(f =>
        f.folderName === 'Student Records' &&
        (!f.parentFolder || f.parentFolder === null)
      );

      console.log('Student Records folder found:', studentRecordsFolder);

      if (studentRecordsFolder) {
        // Log all folders to see their structure
        console.log('All folders structure:', folders.map(f => ({
          id: f.id,
          name: f.folderName,
          parentFolder: f.parentFolder,
          parentFolderId: f.parentFolderId,
          hasParent: !!f.parentFolder,
        })));

        // Filter student folders - check multiple ways the parent might be referenced
        const studentFolders = folders.filter(f => {
          // Skip the Student Records folder itself
          if (f.id === studentRecordsFolder.id) return false;

          // Check if parentFolder.id matches
          const hasParentId = f.parentFolder?.id === studentRecordsFolder.id;
          // Check if parentFolderId matches (direct property)
          const hasParentFolderId = f.parentFolderId === studentRecordsFolder.id;
          // Check if parentFolder object's id matches
          const hasParentFolderObject = f.parentFolder && f.parentFolder.id === studentRecordsFolder.id;

          // Log each folder being checked
          if (f.folderName.includes(' - ')) {
            console.log(`Checking folder "${f.folderName}":`, {
              id: f.id,
              parentFolder: f.parentFolder,
              parentFolderId: f.parentFolderId,
              hasParentId,
              hasParentFolderId,
              hasParentFolderObject,
            });
          }

          return hasParentId || hasParentFolderId || hasParentFolderObject;
        });

        // Also check if Student Records folder has subFolders property
        let allStudentFolders = [...studentFolders];
        if (studentRecordsFolder.subFolders && Array.isArray(studentRecordsFolder.subFolders) && studentRecordsFolder.subFolders.length > 0) {
          console.log('Found subFolders in Student Records:', studentRecordsFolder.subFolders.length);
          // Add subFolders that aren't already in the list
          studentRecordsFolder.subFolders.forEach((subFolder: any) => {
            if (!allStudentFolders.find(f => f.id === subFolder.id)) {
              allStudentFolders.push(subFolder);
            }
          });
        }

        // If still no folders found, try getting folder by ID to see if it has nested structure
        if (allStudentFolders.length === 0) {
          console.log('No student folders found via filter, trying alternative methods...');

          // Method 1: Try fetching detailed folder
          try {
            const detailedFolder = await folderApi.getById(studentRecordsFolder.id);
            console.log('Detailed Student Records folder:', detailedFolder);
            if (detailedFolder.subFolders && Array.isArray(detailedFolder.subFolders) && detailedFolder.subFolders.length > 0) {
              console.log('Found subFolders in detailed folder:', detailedFolder.subFolders.length);
              allStudentFolders = detailedFolder.subFolders;
            }
          } catch (err) {
            console.error('Error fetching detailed folder:', err);
          }

          // Method 2: Check all other folders - if they match student folder pattern, include them
          if (allStudentFolders.length === 0) {
            const otherFolders = folders.filter(f => f.id !== studentRecordsFolder.id);
            console.log('Other folders (not Student Records):', otherFolders);

            // Check if any folder matches the student folder naming pattern: "ID - Name"
            const potentialStudentFolders = otherFolders.filter(folder => {
              const matchesPattern = /^\w+\s*-\s*.+/.test(folder.folderName);
              console.log(`Folder "${folder.folderName}" matches pattern: ${matchesPattern}`, {
                id: folder.id,
                parentFolder: folder.parentFolder,
                parentFolderId: folder.parentFolderId,
              });
              return matchesPattern;
            });

            if (potentialStudentFolders.length > 0) {
              console.log('Found potential student folders by pattern:', potentialStudentFolders.length);
              allStudentFolders = potentialStudentFolders;
            }
          }
        }

        console.log('Student folders found:', allStudentFolders.length);
        console.log('Student folders:', allStudentFolders);

        // Fetch document counts for each student and extract info from folder
        const studentsWithCounts = await Promise.all(
          allStudentFolders.map(async (folder) => {
            try {
              const files = await folderApi.getFilesByFolder(folder.id);
              const match = folder.folderName.match(/^(\w+)\s*-\s*(.+)$/);

              // Extract student info from folder name
              const studentId = match ? match[1] : folder.folderName;
              const fullName = match ? match[2] : folder.folderName;

              // Extract additional info from folder description if available
              let email = '';
              let phone = '';
              let department = '';
              let year = '2024';

              if (folder.description) {
                // Parse description format: "Student: {name} | ID: {id} | Department: {dept} | Year: {year} | Email: {email} | Phone: {phone}"
                const deptMatch = folder.description.match(/Department:\s*([^|]+)/i);
                const yearMatch = folder.description.match(/Year:\s*(\d{4})/i);
                const emailMatch = folder.description.match(/Email:\s*([^\s|]+)/i);
                const phoneMatch = folder.description.match(/Phone:\s*([^\s|]+)/i);

                if (deptMatch) department = deptMatch[1].trim();
                if (yearMatch) year = yearMatch[1].trim();
                if (emailMatch) email = emailMatch[1].trim();
                if (phoneMatch) phone = phoneMatch[1].trim();
              }

              return {
                id: folder.id.toString(),
                studentId,
                fullName,
                email: email || '',
                phone: phone || '',
                department: department || 'Unknown',
                year: year || '2024',
                documentCount: files.length,
                folderId: folder.id, // Store folder ID for uploads
              };
            } catch (err) {
              // Fallback if file fetch fails
              const match = folder.folderName.match(/^(\w+)\s*-\s*(.+)$/);
              const studentId = match ? match[1] : folder.folderName;
              const fullName = match ? match[2] : folder.folderName;

              // Try to extract info from description
              let department = 'Unknown';
              let year = '2024';
              let email = '';
              let phone = '';

              if (folder.description) {
                const deptMatch = folder.description.match(/Department:\s*([^|]+)/i);
                const yearMatch = folder.description.match(/Year:\s*(\d{4})/i);
                const emailMatch = folder.description.match(/Email:\s*([^\s|]+)/i);
                const phoneMatch = folder.description.match(/Phone:\s*([^\s|]+)/i);

                if (deptMatch) department = deptMatch[1].trim();
                if (yearMatch) year = yearMatch[1].trim();
                if (emailMatch) email = emailMatch[1].trim();
                if (phoneMatch) phone = phoneMatch[1].trim();
              }

              return {
                id: folder.id.toString(),
                studentId,
                fullName,
                email: email || '',
                phone: phone || '',
                department: department || 'Unknown',
                year: year || '2024',
                documentCount: 0,
                folderId: folder.id, // Store folder ID for uploads
              };
            }
          })
        );

        // Set students from database only
        console.log('Setting students:', studentsWithCounts.length);
        setStudents(studentsWithCounts);
      } else {
        // No Student Records folder exists - show empty list
        console.log('No Student Records folder found. Available folders:', folders.map(f => ({ id: f.id, name: f.folderName, parent: f.parentFolder?.id || f.parentFolderId })));
        setStudents([]);
      }
    } catch (error) {
      console.error('Failed to fetch students:', error);
      // Show empty list on error instead of mock data
      setStudents([]);
    } finally {
      // setLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = [...students];

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (student) =>
          student.studentId.toLowerCase().includes(term) ||
          student.fullName.toLowerCase().includes(term)
      );
    }

    // Filter by department
    if (selectedDepartment !== 'All Departments') {
      filtered = filtered.filter((student) => student.department === selectedDepartment);
    }

    setFilteredStudents(filtered);
  };

  const handleCreateStudent = async () => {
    // Validation
    if (!formData.studentId?.trim()) {
      setSnackbarMessage('Please enter a Student ID');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    if (!formData.fullName?.trim()) {
      setSnackbarMessage('Please enter the student\'s full name');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    if (!formData.department) {
      setSnackbarMessage('Please select a department');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    setCreating(true);

    try {
      console.log('Creating student folder with data:', formData);

      // Step 1: Find or create Student Records folder
      let foldersResponse = await folderApi.getAll();
      // Ensure folders is an array
      let folders: any[] = Array.isArray(foldersResponse) ? foldersResponse : [];

      if (!Array.isArray(foldersResponse)) {
        console.warn('foldersApi.getAll() did not return an array:', foldersResponse);
        folders = [];
      }

      let studentRecordsFolder = folders.find(
        (f) => f.folderName === 'Student Records' && !f.parentFolder
      );

      if (!studentRecordsFolder) {
        console.log('Creating Student Records root folder...');
        studentRecordsFolder = await folderApi.create({
          folderName: 'Student Records',
          description: 'Main folder for all student records',
          // Don't include parentFolderId for root folder - backend will handle null/undefined
        });
        console.log('Student Records folder created:', studentRecordsFolder);
        // Refresh folders list to get the latest data
        foldersResponse = await folderApi.getAll();
        folders = Array.isArray(foldersResponse) ? foldersResponse : [];
      } else {
        console.log('Student Records folder found:', studentRecordsFolder);
      }

      // Step 2: Check if student folder already exists (refresh folders list first)
      foldersResponse = await folderApi.getAll();
      folders = Array.isArray(foldersResponse) ? foldersResponse : [];
      const folderName = `${formData.studentId} - ${formData.fullName}`;
      const existingFolder = folders.find(
        (f) => f.folderName === folderName && f.parentFolder?.id === studentRecordsFolder.id
      );

      if (existingFolder) {
        setSnackbarMessage(`Student folder "${folderName}" already exists`);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        setCreating(false);
        return;
      }

      // Step 3: Create student folder with detailed description
      const description = `Student: ${formData.fullName} | ID: ${formData.studentId} | Department: ${formData.department} | Year: ${formData.year}${formData.email ? ` | Email: ${formData.email}` : ''}${formData.phone ? ` | Phone: ${formData.phone}` : ''}`;

      console.log('Creating student folder:', {
        folderName,
        description,
        parentFolderId: studentRecordsFolder.id,
      });

      const newFolder = await folderApi.create({
        folderName,
        description,
        parentFolderId: studentRecordsFolder.id,
      });

      console.log('Student folder created successfully:', newFolder);

      // Step 4: Refresh the student list
      await fetchStudents();

      // Step 5: Show success message and close modal
      setSnackbarMessage(`Student folder "${folderName}" created successfully!`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setCreateModalOpen(false);

      // Step 6: Reset form
      setFormData({
        studentId: '',
        fullName: '',
        email: '',
        phone: '',
        department: '',
        year: '2024',
      });
    } catch (error: any) {
      console.error('Failed to create student folder:', error);

      // Extract error message
      let errorMessage = 'Failed to create student folder. Please try again.';

      if (error.response) {
        // Backend returned an error response
        const status = error.response.status;
        const data = error.response.data;

        if (status === 400) {
          errorMessage = data?.message || 'Invalid data. Please check your input.';
        } else if (status === 401) {
          errorMessage = 'You are not authorized to perform this action.';
        } else if (status === 403) {
          errorMessage = 'You do not have permission to create folders.';
        } else if (status === 409) {
          errorMessage = 'A folder with this name already exists.';
        } else if (status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (data?.message) {
          errorMessage = data.message;
        }
      } else if (error.isNetworkError || error.code === 'ERR_NETWORK' || error.message?.includes('ERR_CONNECTION_REFUSED')) {
        errorMessage = 'Cannot connect to the server. Please make sure the backend server is running.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setCreating(false);
    }
  };

  const handleStudentClick = (student: Student) => {
    // Navigate to student detail page or open folder
    console.log('Opening student folder:', student);
  };

  const handleDeleteStudent = async (student: Student, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent card click

    if (!student.folderId) {
      setSnackbarMessage('Cannot delete: Folder ID not found.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    const confirmMessage = `Are you sure you want to delete the folder for "${student.studentId} - ${student.fullName}"?\n\nThis will also delete all files in this folder. This action cannot be undone.`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      await folderApi.delete(student.folderId);
      setSnackbarMessage(`Student folder "${student.studentId} - ${student.fullName}" deleted successfully!`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      // Refresh the student list
      await fetchStudents();
    } catch (error: any) {
      console.error('Failed to delete student folder:', error);
      let errorMessage = 'Failed to delete student folder. Please try again.';

      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        if (status === 404) {
          errorMessage = 'Folder not found. It may have already been deleted.';
        } else if (status === 403) {
          errorMessage = 'You do not have permission to delete folders.';
        } else if (status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (data?.message) {
          errorMessage = data.message;
        }
      } else if (error.isNetworkError || error.code === 'ERR_NETWORK' || error.message?.includes('ERR_CONNECTION_REFUSED')) {
        errorMessage = 'Cannot connect to the server. Please make sure the backend server is running.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleUploadClick = (student: Student) => {
    if (!student.folderId) {
      setSnackbarMessage('Folder ID not found for this student. Please refresh the page.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
    setSelectedFolderId(student.folderId);
    setSelectedStudentName(`${student.studentId} - ${student.fullName}`);
    setUploadModalOpen(true);
  };

  const handleFileUpload = async (
    file: globalThis.File,
    fileName: string,
    description: string
  ) => {
    if (!selectedFolderId || !user?.id) {
      setSnackbarMessage('Please select a folder and ensure you are logged in.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    setUploading(true);
    try {
      await fileApi.upload(file, user.id, selectedFolderId, description);
      setSnackbarMessage(`File "${fileName}" uploaded successfully to ${selectedStudentName}!`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setUploadModalOpen(false);
      setSelectedFolderId(null);
      setSelectedStudentName('');
      // Refresh student list to update document counts
      await fetchStudents();
    } catch (error: any) {
      console.error('File upload failed:', error);
      let errorMessage = 'File upload failed. Please try again.';

      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        if (status === 400) {
          errorMessage = data?.message || 'Invalid file data. Please check your input.';
        } else if (status === 401) {
          errorMessage = 'You are not authorized to upload files.';
        } else if (status === 403) {
          errorMessage = 'You do not have permission to upload files.';
        } else if (status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (data?.message) {
          errorMessage = data.message;
        }
      } else if (error.isNetworkError || error.code === 'ERR_NETWORK' || error.message?.includes('ERR_CONNECTION_REFUSED')) {
        errorMessage = 'Cannot connect to the server. Please make sure the backend server is running.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 0.5 }}>
          Student Records
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Manage student records and folders
        </Typography>

        {/* Actions Bar */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            All Students
          </Typography>
          <Button
            variant="contained"
            startIcon={<FolderIcon />}
            onClick={() => setCreateModalOpen(true)}
            sx={{
              backgroundColor: '#2196f3',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#1976d2',
              },
            }}
          >
            New Student
          </Button>
        </Box>

        {/* Search and Filters */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search by student ID or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ flexGrow: 1, minWidth: 300 }}
          />
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Department</InputLabel>
            <Select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              label="Department"
            >
              <MenuItem value="All Departments">All Departments</MenuItem>
              {DEPARTMENTS.map((dept) => (
                <MenuItem key={dept} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Document Type</InputLabel>
            <Select
              value={selectedDocType}
              onChange={(e) => setSelectedDocType(e.target.value)}
              label="Document Type"
            >
              {DOCUMENT_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Student List */}
      <Box>
        {filteredStudents.length === 0 ? (
          <Card>
            <CardContent>
              <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
                No students found
              </Typography>
            </CardContent>
          </Card>
        ) : (
          filteredStudents.map((student) => (
            <Card
              key={student.id}
              sx={{
                mb: 2,
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 4,
                  backgroundColor: '#fafafa',
                },
              }}
              onClick={() => handleStudentClick(student)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: '#2196f3', width: 48, height: 48 }}>
                    <PersonIcon />
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {student.studentId} - {student.fullName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {student.department} • {student.year}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {student.documentCount} docs
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<CloudUploadIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUploadClick(student);
                      }}
                      disabled={!student.folderId}
                      sx={{
                        textTransform: 'none',
                        borderColor: '#2196f3',
                        color: '#2196f3',
                        '&:hover': {
                          borderColor: '#1976d2',
                          backgroundColor: '#e3f2fd',
                        },
                        '&:disabled': {
                          borderColor: '#ccc',
                          color: '#999',
                        },
                      }}
                    >
                      Upload
                    </Button>
                    <IconButton
                      size="small"
                      onClick={(e) => handleDeleteStudent(student, e)}
                      sx={{
                        color: '#f44336',
                        '&:hover': {
                          backgroundColor: '#ffebee',
                        },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleStudentClick(student)}>
                      <ArrowForwardIcon />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </Box>

      {/* Create Student Modal */}
      <Dialog
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Create New Student Folder
          </Typography>
          <IconButton
            size="small"
            onClick={() => setCreateModalOpen(false)}
            sx={{ color: 'text.secondary' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Student ID"
                fullWidth
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                placeholder="e.g., STU005"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Full Name"
                fullWidth
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Enter full name"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email Address"
                fullWidth
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email address"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Phone Number"
                fullWidth
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Enter phone number"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Select Department</InputLabel>
                <Select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  label="Select Department"
                >
                  {DEPARTMENTS.map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      {dept}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Year</InputLabel>
                <Select
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  label="Year"
                >
                  {YEARS.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button
            onClick={() => setCreateModalOpen(false)}
            disabled={creating}
            sx={{ textTransform: 'none', color: 'text.secondary' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateStudent}
            variant="contained"
            disabled={creating}
            startIcon={creating ? <CircularProgress size={16} color="inherit" /> : null}
            sx={{
              backgroundColor: '#2196f3',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#1976d2',
              },
              '&:disabled': {
                backgroundColor: '#90caf9',
              },
            }}
          >
            {creating ? 'Creating...' : 'Create Folder'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* File Upload Modal */}
      <FileUploadModal
        open={uploadModalOpen}
        onClose={() => {
          setUploadModalOpen(false);
          setSelectedFolderId(null);
          setSelectedStudentName('');
        }}
        onUpload={handleFileUpload}
        uploading={uploading}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};
