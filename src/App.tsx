import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Paper,
    TextField,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Container,
    Grid,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import { FaSnowflake, FaHome, FaListAlt, FaGift, FaUserPlus, FaSync } from 'react-icons/fa';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { Howl } from 'howler';
import './App.css'; // Add custom CSS for snow animation

// Types
type Assignments = Record<string, string>;

// Helper function to load data from localStorage
const loadFromLocalStorage = <T,>(key: string, defaultValue: T): T => {
    const savedData = localStorage.getItem(key);
    return savedData ? JSON.parse(savedData) : defaultValue;
};

// Main App Component
function App(): JSX.Element {
    return (
        <SnackbarProvider maxSnack={3}>
            <div className='snow-bg'>
                {' '}
                {/* Snow effect */}
                <Router>
                    <AppBar position='sticky' sx={{ background: 'linear-gradient(to right, #4e54c8, #8f94fb)' }}>
                        <Toolbar>
                            <Typography
                                variant='h6'
                                sx={{
                                    flexGrow: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontWeight: 700,
                                    letterSpacing: '.1rem',
                                }}
                            >
                                <FaSnowflake style={{ marginRight: 8 }} />
                                Secret Santa
                            </Typography>
                            <NavButtons />
                        </Toolbar>
                    </AppBar>
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/assignments' element={<Assignments />} />
                    </Routes>
                </Router>
            </div>
        </SnackbarProvider>
    );
}

// Navbar Buttons
function NavButtons(): JSX.Element {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: isMobile ? 1 : 2 }}>
            <Button
                component={NavLink}
                to='/'
                startIcon={<FaHome />}
                color='inherit'
                sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    '&.active': { borderBottom: '2px solid gold' },
                }}
            >
                Home
            </Button>
            <Button
                component={NavLink}
                to='/assignments'
                startIcon={<FaListAlt />}
                color='inherit'
                sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    '&.active': { borderBottom: '2px solid gold' },
                }}
            >
                Assignments
            </Button>
        </Box>
    );
}

// Home Component
function Home(): JSX.Element {
    const [participants, setParticipants] = useState<string[]>(() =>
        loadFromLocalStorage<string[]>('participants', [])
    );
    const [availableNames, setAvailableNames] = useState<string[]>(() =>
        loadFromLocalStorage<string[]>('availableNames', [])
    );
    const [assignments, setAssignments] = useState<Assignments>(() =>
        loadFromLocalStorage<Assignments>('assignments', {})
    );
    const [assignedParticipants, setAssignedParticipants] = useState<string[]>(() =>
        loadFromLocalStorage<string[]>('assignedParticipants', [])
    );

    const bellSound = new Howl({
        src: ['https://www.myinstants.com/media/sounds/christmas-bell.mp3'],
    });

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        localStorage.setItem('participants', JSON.stringify(participants));
        localStorage.setItem('availableNames', JSON.stringify(availableNames));
        localStorage.setItem('assignments', JSON.stringify(assignments));
        localStorage.setItem('assignedParticipants', JSON.stringify(assignedParticipants));
    }, [participants, availableNames, assignments, assignedParticipants]);

    const addParticipant = (name: string) => {
        if (name && !participants.includes(name)) {
            bellSound.play();
            setParticipants([...participants, name]);
            setAvailableNames([...availableNames, name]);
            enqueueSnackbar(`${name} has been added!`, { variant: 'success' });
        } else {
            enqueueSnackbar('Please enter a unique name!', { variant: 'warning' });
        }
    };

    const drawName = (currentParticipant: string) => {
        if (!availableNames.length) {
            enqueueSnackbar('All names have been assigned!', { variant: 'info' });
            return;
        }
        const filteredNames = availableNames.filter((name) => name !== currentParticipant);
        if (!filteredNames.length) {
            enqueueSnackbar('No valid names left for this participant.', { variant: 'warning' });
            return;
        }
        bellSound.play();
        const randomIndex = Math.floor(Math.random() * filteredNames.length);
        const selectedName = filteredNames[randomIndex];
        setAssignments({ ...assignments, [currentParticipant]: selectedName });
        setAvailableNames(availableNames.filter((name) => name !== selectedName));
        setAssignedParticipants([...assignedParticipants, currentParticipant]);
        enqueueSnackbar(`${currentParticipant} has drawn ${selectedName}!`, { variant: 'success' });
    };

    const resetAll = () => {
        setParticipants([]);
        setAvailableNames([]);
        setAssignments({});
        setAssignedParticipants([]);
        localStorage.clear();
        enqueueSnackbar('All data has been reset!', { variant: 'info' });
    };

    return (
        <Container sx={{ mt: 4 }}>
            <AddParticipants addParticipant={addParticipant} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <DrawName participants={participants} drawName={drawName} assignedParticipants={assignedParticipants} />
                <DrawnList assignedParticipants={assignedParticipants} />
            </Box>
            <Button
                onClick={resetAll}
                variant='contained'
                color='secondary'
                startIcon={<FaSync />}
                fullWidth
                sx={{ mt: 4 }}
            >
                Reset All
            </Button>
        </Container>
    );
}

// Add Participants Component
function AddParticipants({ addParticipant }: { addParticipant: (name: string) => void }): JSX.Element {
    const [name, setName] = useState<string>('');

    const handleAdd = () => {
        if (name.trim()) {
            addParticipant(name.trim());
            setName('');
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            handleAdd();
        }
    };

    return (
        <Paper sx={{ p: 4, mb: 2, backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
            <Typography variant='h6' gutterBottom>
                <FaUserPlus /> Add Participants
            </Typography>
            <TextField
                fullWidth
                label='Enter name'
                variant='outlined'
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleKeyDown}
                sx={{ mb: 2 }}
            />
            <Button variant='contained' color='primary' onClick={handleAdd} fullWidth>
                Add
            </Button>
        </Paper>
    );
}

// Draw Name Component
function DrawName({
    participants,
    drawName,
    assignedParticipants,
}: {
    participants: string[];
    drawName: (currentParticipant: string) => void;
    assignedParticipants: string[];
}): JSX.Element {
    const remainingParticipants = participants.filter((participant) => !assignedParticipants.includes(participant));

    return (
        <Paper sx={{ p: 4, flex: 1 }}>
            <Typography variant='h6' gutterBottom>
                <FaGift /> Draw Names
            </Typography>
            <List>
                {remainingParticipants.map((participant) => (
                    <ListItem key={participant} disablePadding>
                        <ListItemText primary={participant} />
                        <IconButton onClick={() => drawName(participant)}>
                            <FaGift />
                        </IconButton>
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
}

// Drawn List Component
function DrawnList({ assignedParticipants }: { assignedParticipants: string[] }): JSX.Element {
    return (
        <Paper sx={{ p: 4, flex: 1 }}>
            <Typography variant='h6' gutterBottom>
                Drawn Participants
            </Typography>
            <List>
                {assignedParticipants.map((participant) => (
                    <ListItem key={participant} disablePadding>
                        <ListItemText primary={participant} sx={{ textDecoration: 'line-through', color: 'gray' }} />
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
}

// Assignments Component
function Assignments(): JSX.Element {
    const [assignments, setAssignments] = useState<Assignments>(() =>
        loadFromLocalStorage<Assignments>('assignments', {})
    );

    return (
        <Container sx={{ mt: 4 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant='h6' gutterBottom>
                    <FaListAlt /> Assignments
                </Typography>
                <List>
                    {Object.entries(assignments).map(([giver, receiver]) => (
                        <ListItem key={giver} divider>
                            <ListItemText primary={`${giver} → ${receiver}`} />
                        </ListItem>
                    ))}
                </List>
                <Button variant='contained' color='primary' component={NavLink} to='/' fullWidth>
                    Back to Home
                </Button>
            </Paper>
        </Container>
    );
}

export default App;
