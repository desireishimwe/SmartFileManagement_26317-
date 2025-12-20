import React, { useState, useEffect } from 'react';
import {
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Typography,
    Stack,
    SelectChangeEvent,
    alpha,
    useTheme,
} from '@mui/material';
import { Location } from '../../types/location';
import { locationApi } from '../../api/locationApi';

interface LocationCascadeSelectorProps {
    onLocationSelect: (locationId: number | null) => void;
    initialLocationId?: number | null;
    error?: string;
}

export const LocationCascadeSelector: React.FC<LocationCascadeSelectorProps> = ({
    onLocationSelect,
    initialLocationId: _initialLocationId,
    error,
}) => {
    const theme = useTheme();
    const [provinces, setProvinces] = useState<Location[]>([]);
    const [districts, setDistricts] = useState<Location[]>([]);
    const [sectors, setSectors] = useState<Location[]>([]);
    const [cells, setCells] = useState<Location[]>([]);

    const [selectedProvince, setSelectedProvince] = useState<number | ''>('');
    const [selectedDistrict, setSelectedDistrict] = useState<number | ''>('');
    const [selectedSector, setSelectedSector] = useState<number | ''>('');
    const [selectedCell, setSelectedCell] = useState<number | ''>('');

    const [loadingProvinces, setLoadingProvinces] = useState(false);
    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [loadingSectors, setLoadingSectors] = useState(false);
    const [loadingCells, setLoadingCells] = useState(false);

    // Load provinces on mount
    useEffect(() => {
        const loadProvinces = async () => {
            setLoadingProvinces(true);
            try {
                const data = await locationApi.getProvinces();
                setProvinces(data);
            } catch (err) {
                console.error('Failed to load provinces:', err);
            }
            setLoadingProvinces(false);
        };
        loadProvinces();
    }, []);

    // Load districts when province changes
    useEffect(() => {
        if (selectedProvince) {
            const loadDistricts = async () => {
                setLoadingDistricts(true);
                setDistricts([]);
                setSectors([]);
                setCells([]);
                setSelectedDistrict('');
                setSelectedSector('');
                setSelectedCell('');
                try {
                    const data = await locationApi.getChildrenAll(selectedProvince as number);
                    setDistricts(data);
                } catch (err) {
                    console.error('Failed to load districts:', err);
                }
                setLoadingDistricts(false);
            };
            loadDistricts();
        }
    }, [selectedProvince]);

    // Load sectors when district changes
    useEffect(() => {
        if (selectedDistrict) {
            const loadSectors = async () => {
                setLoadingSectors(true);
                setSectors([]);
                setCells([]);
                setSelectedSector('');
                setSelectedCell('');
                try {
                    const data = await locationApi.getChildrenAll(selectedDistrict as number);
                    setSectors(data);
                } catch (err) {
                    console.error('Failed to load sectors:', err);
                }
                setLoadingSectors(false);
            };
            loadSectors();
        }
    }, [selectedDistrict]);

    // Load cells when sector changes
    useEffect(() => {
        if (selectedSector) {
            const loadCells = async () => {
                setLoadingCells(true);
                setCells([]);
                setSelectedCell('');
                try {
                    const data = await locationApi.getChildrenAll(selectedSector as number);
                    setCells(data);
                } catch (err) {
                    console.error('Failed to load cells:', err);
                }
                setLoadingCells(false);
            };
            loadCells();
        }
    }, [selectedSector]);

    // Notify parent of selection - use the most specific selection
    useEffect(() => {
        if (selectedCell) {
            onLocationSelect(selectedCell as number);
        } else if (selectedSector) {
            onLocationSelect(selectedSector as number);
        } else if (selectedDistrict) {
            onLocationSelect(selectedDistrict as number);
        } else if (selectedProvince) {
            onLocationSelect(selectedProvince as number);
        } else {
            onLocationSelect(null);
        }
    }, [selectedProvince, selectedDistrict, selectedSector, selectedCell]);

    const handleProvinceChange = (event: SelectChangeEvent<number | ''>) => {
        setSelectedProvince(event.target.value as number | '');
    };

    const handleDistrictChange = (event: SelectChangeEvent<number | ''>) => {
        setSelectedDistrict(event.target.value as number | '');
    };

    const handleSectorChange = (event: SelectChangeEvent<number | ''>) => {
        setSelectedSector(event.target.value as number | '');
    };

    const handleCellChange = (event: SelectChangeEvent<number | ''>) => {
        setSelectedCell(event.target.value as number | '');
    };

    return (
        <Box
            sx={{
                p: 2,
                border: `1px solid ${error ? theme.palette.error.main : theme.palette.divider}`,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.02),
            }}
        >
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                Select Your Location (Rwanda)
            </Typography>

            <Stack spacing={2}>
                {/* Province */}
                <FormControl fullWidth size="small">
                    <InputLabel>Province</InputLabel>
                    <Select
                        value={selectedProvince}
                        onChange={handleProvinceChange}
                        label="Province"
                        disabled={loadingProvinces}
                        endAdornment={loadingProvinces ? <CircularProgress size={20} sx={{ mr: 3 }} /> : null}
                    >
                        <MenuItem value="">
                            <em>Select Province</em>
                        </MenuItem>
                        {Array.isArray(provinces) && provinces.map((province) => (
                            <MenuItem key={province.id} value={province.id}>
                                {province.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* District */}
                <FormControl fullWidth size="small" disabled={!selectedProvince}>
                    <InputLabel>District</InputLabel>
                    <Select
                        value={selectedDistrict}
                        onChange={handleDistrictChange}
                        label="District"
                        disabled={!selectedProvince || loadingDistricts}
                        endAdornment={loadingDistricts ? <CircularProgress size={20} sx={{ mr: 3 }} /> : null}
                    >
                        <MenuItem value="">
                            <em>Select District</em>
                        </MenuItem>
                        {Array.isArray(districts) && districts.map((district) => (
                            <MenuItem key={district.id} value={district.id}>
                                {district.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Sector */}
                <FormControl fullWidth size="small" disabled={!selectedDistrict}>
                    <InputLabel>Sector</InputLabel>
                    <Select
                        value={selectedSector}
                        onChange={handleSectorChange}
                        label="Sector"
                        disabled={!selectedDistrict || loadingSectors}
                        endAdornment={loadingSectors ? <CircularProgress size={20} sx={{ mr: 3 }} /> : null}
                    >
                        <MenuItem value="">
                            <em>Select Sector</em>
                        </MenuItem>
                        {Array.isArray(sectors) && sectors.map((sector) => (
                            <MenuItem key={sector.id} value={sector.id}>
                                {sector.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Cell */}
                <FormControl fullWidth size="small" disabled={!selectedSector}>
                    <InputLabel>Cell</InputLabel>
                    <Select
                        value={selectedCell}
                        onChange={handleCellChange}
                        label="Cell"
                        disabled={!selectedSector || loadingCells}
                        endAdornment={loadingCells ? <CircularProgress size={20} sx={{ mr: 3 }} /> : null}
                    >
                        <MenuItem value="">
                            <em>Select Cell</em>
                        </MenuItem>
                        {Array.isArray(cells) && cells.map((cell) => (
                            <MenuItem key={cell.id} value={cell.id}>
                                {cell.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Stack>

            {error && (
                <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                    {error}
                </Typography>
            )}
        </Box>
    );
};

export default LocationCascadeSelector;
