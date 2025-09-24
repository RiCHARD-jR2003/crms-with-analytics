import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Alert,
  Button,
  Divider,
  Tooltip,
  IconButton,
  Paper,
  Stack
} from '@mui/material';
import {
  ExpandMore,
  Lightbulb,
  TrendingUp,
  Speed,
  Warning,
  CheckCircle,
  Info,
  PriorityHigh,
  Flag,
  LowPriority,
  Refresh,
  FilterList,
  Assignment,
  Schedule,
  CardGiftcard,
  Receipt,
  Campaign,
  SupportAgent,
  Shield,
  HelpCenter,
  Chat,
  PersonAdd,
  Accessibility,
  Dashboard,
  IntegrationInstructions,
  Timeline,
  Assessment
} from '@mui/icons-material';
import analyticsService from '../../services/analyticsService';

const SuggestionsSection = ({ dateRange, selectedBarangay, onRefresh }) => {
  const [suggestions, setSuggestions] = useState({});
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');

  useEffect(() => {
    loadSuggestions();
  }, [dateRange, selectedBarangay]);

  const loadSuggestions = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (dateRange?.start && dateRange?.end) {
        params.start_date = dateRange.start;
        params.end_date = dateRange.end;
      }
      if (selectedBarangay && selectedBarangay !== 'all') {
        params.barangay = selectedBarangay;
      }

      const [suggestionsResponse, summaryResponse] = await Promise.all([
        analyticsService.getAutomatedSuggestions(params),
        analyticsService.getSuggestionSummary(params)
      ]);

      if (suggestionsResponse.success) {
        setSuggestions(suggestionsResponse.data.suggestions);
      }

      if (summaryResponse.success) {
        setSummary(summaryResponse.data.summary);
      }

    } catch (err) {
      console.error('Error loading suggestions:', err);
      setError('Failed to load automated suggestions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadSuggestions();
    if (onRefresh) onRefresh();
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <PriorityHigh color="error" />;
      case 'medium': return <Flag color="warning" />;
      case 'low': return <LowPriority color="info" />;
      default: return <Info />;
    }
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      'Application Processing': <Assignment />,
      'Processing Speed': <Speed />,
      'Processing Time': <Schedule />,
      'Service Utilization': <TrendingUp />,
      'Benefit Utilization': <CardGiftcard />,
      'Claim Processing': <Receipt />,
      'Service Promotion': <Campaign />,
      'Complaint Resolution': <SupportAgent />,
      'Issue Prevention': <Shield />,
      'Support Quality': <HelpCenter />,
      'Support Responsiveness': <Chat />,
      'Registration Growth': <PersonAdd />,
      'Service Inclusivity': <Accessibility />,
      'Overall Performance': <Dashboard />,
      'Service Integration': <IntegrationInstructions />
    };
    return iconMap[category] || <Lightbulb />;
  };

  const filterSuggestions = () => {
    let filtered = { ...suggestions };

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = { [selectedCategory]: filtered[selectedCategory] || [] };
    }

    // Filter by priority
    if (selectedPriority !== 'all') {
      Object.keys(filtered).forEach(category => {
        filtered[category] = filtered[category].filter(
          suggestion => suggestion.priority === selectedPriority
        );
      });
    }

    return filtered;
  };

  const getSuggestionTypeColor = (type) => {
    const colorMap = {
      improvement: 'primary',
      efficiency: 'secondary',
      outreach: 'success',
      utilization: 'info',
      promotion: 'warning',
      service_quality: 'error',
      prevention: 'default'
    };
    return colorMap[type] || 'default';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Analyzing system data and generating suggestions...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert 
        severity="error" 
        action={
          <Button color="inherit" size="small" onClick={handleRefresh}>
            Retry
          </Button>
        }
      >
        {error}
      </Alert>
    );
  }

  const filteredSuggestions = filterSuggestions();
  const totalSuggestions = Object.values(filteredSuggestions).reduce(
    (sum, categoryItems) => sum + categoryItems.length, 0
  );

  return (
    <Box>
      {/* Header with Summary */}
      <Card sx={{ mb: 3 }}>
        <CardHeader
          title={
            <Box display="flex" alignItems="center" gap={1}>
              <Assessment color="primary" />
              <Typography variant="h5">Automated Suggestions</Typography>
              <Tooltip title="Refresh suggestions">
                <IconButton onClick={handleRefresh} size="small">
                  <Refresh />
                </IconButton>
              </Tooltip>
            </Box>
          }
          subheader="AI-powered recommendations based on system analysis"
        />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.light', color: 'white' }}>
                <Typography variant="h4">{summary.total_suggestions || 0}</Typography>
                <Typography variant="body2">Total Suggestions</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'error.light', color: 'white' }}>
                <Typography variant="h4">{summary.high_priority || 0}</Typography>
                <Typography variant="body2">High Priority</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.light', color: 'white' }}>
                <Typography variant="h4">{summary.medium_priority || 0}</Typography>
                <Typography variant="body2">Medium Priority</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'info.light', color: 'white' }}>
                <Typography variant="h4">{summary.low_priority || 0}</Typography>
                <Typography variant="body2">Low Priority</Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Filters */}
          <Box mt={3}>
            <Stack direction="row" spacing={2} alignItems="center">
              <FilterList />
              <Typography variant="subtitle2">Filters:</Typography>
              
              <Button
                variant={selectedCategory === 'all' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setSelectedCategory('all')}
              >
                All Categories
              </Button>
              
              {Object.keys(suggestions).map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
              
              <Divider orientation="vertical" flexItem />
              
              <Button
                variant={selectedPriority === 'all' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setSelectedPriority('all')}
              >
                All Priorities
              </Button>
              
              {['high', 'medium', 'low'].map(priority => (
                <Button
                  key={priority}
                  variant={selectedPriority === priority ? 'contained' : 'outlined'}
                  size="small"
                  color={priority === 'high' ? 'error' : priority === 'medium' ? 'warning' : 'info'}
                  onClick={() => setSelectedPriority(priority)}
                >
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </Button>
              ))}
            </Stack>
          </Box>
        </CardContent>
      </Card>

      {/* Suggestions by Category */}
      {totalSuggestions === 0 ? (
        <Alert severity="success" icon={<CheckCircle />}>
          <Typography variant="h6">Excellent Performance!</Typography>
          <Typography>
            No critical issues detected. Your system is performing well across all metrics.
            Continue monitoring for optimal performance.
          </Typography>
        </Alert>
      ) : (
        Object.entries(filteredSuggestions).map(([category, categoryItems]) => {
          if (!categoryItems || categoryItems.length === 0) return null;

          return (
            <Card key={category} sx={{ mb: 2 }}>
              <CardHeader
                title={
                  <Box display="flex" alignItems="center" gap={1}>
                    {getCategoryIcon(categoryItems[0]?.category)}
                    <Typography variant="h6">
                      {category.charAt(0).toUpperCase() + category.slice(1)} Suggestions
                    </Typography>
                    <Chip 
                      label={`${categoryItems.length} item${categoryItems.length !== 1 ? 's' : ''}`} 
                      size="small" 
                      color="primary" 
                    />
                  </Box>
                }
              />
              <CardContent>
                {categoryItems.map((suggestion, index) => (
                  <Accordion key={index} sx={{ mb: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Box display="flex" alignItems="center" gap={2} width="100%">
                        {getPriorityIcon(suggestion.priority)}
                        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                          {suggestion.title}
                        </Typography>
                        <Chip
                          label={suggestion.priority.toUpperCase()}
                          size="small"
                          color={
                            suggestion.priority === 'high' ? 'error' :
                            suggestion.priority === 'medium' ? 'warning' : 'info'
                          }
                        />
                        <Chip
                          label={suggestion.type.replace('_', ' ').toUpperCase()}
                          size="small"
                          variant="outlined"
                          color={getSuggestionTypeColor(suggestion.type)}
                        />
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography variant="body1" paragraph>
                            {suggestion.description}
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" gutterBottom>
                            Recommendations:
                          </Typography>
                          <List dense>
                            {suggestion.recommendations?.map((rec, recIndex) => (
                              <ListItem key={recIndex}>
                                <ListItemIcon>
                                  <Lightbulb fontSize="small" color="primary" />
                                </ListItemIcon>
                                <ListItemText primary={rec} />
                              </ListItem>
                            ))}
                          </List>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                          <Box>
                            <Typography variant="subtitle2" gutterBottom>
                              Implementation Details:
                            </Typography>
                            <List dense>
                              <ListItem>
                                <ListItemIcon>
                                  <TrendingUp fontSize="small" color="success" />
                                </ListItemIcon>
                                <ListItemText 
                                  primary="Expected Impact"
                                  secondary={suggestion.expected_impact}
                                />
                              </ListItem>
                              <ListItem>
                                <ListItemIcon>
                                  <Timeline fontSize="small" color="info" />
                                </ListItemIcon>
                                <ListItemText 
                                  primary="Timeframe"
                                  secondary={suggestion.estimated_timeframe}
                                />
                              </ListItem>
                              <ListItem>
                                <ListItemIcon>
                                  <Assessment fontSize="small" color="warning" />
                                </ListItemIcon>
                                <ListItemText 
                                  primary="Difficulty"
                                  secondary={suggestion.implementation_difficulty}
                                />
                              </ListItem>
                            </List>
                          </Box>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </CardContent>
            </Card>
          );
        })
      )}
    </Box>
  );
};

export default SuggestionsSection;
