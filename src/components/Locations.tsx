import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentLocation,
  addPreviousLocation,
  clearPreviousLocations,
  removePreviousLocation,
} from "./reducers/reducer/locationSlice";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface Location {
  latitude: number;
  longitude: number;
}

interface Position {
  coords: {
    latitude: number;
    longitude: number;
  };
}

interface PositionError {
  message: string;
  code: number;
}

const Locations = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const currentLocation = useSelector(
    (state: any) => state.locationList.currentLocation
  );
  const previousLocations = useSelector(
    (state: any) => state.locationList.previousLocations
  );
  const navigation = useNavigate();
  const key = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const dispatch = useDispatch();
  const [presentAddress, setPresent] = useState<any>();
  useEffect(() => {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };
    let currentAddress: any = null;
    const fetchLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position: Position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          axios
            .get(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${key}`
            )
            .then((response) => {
              const address = response.data.results[0].formatted_address;
              const dateTime = new Date().toLocaleString();
              dispatch(
                setCurrentLocation({ address, latitude, longitude, dateTime })
              );
              currentAddress = { address, latitude, longitude, dateTime };

              setPresent(currentAddress);
            })
            .catch((error) => {
              console.log(error);
            });
        },
        (error: PositionError) => {
          console.log(error);
        },
        options
      );
    };

    fetchLocation();
    const intervalId = setInterval(() => {
      dispatch(addPreviousLocation(currentAddress));
      fetchLocation();
    }, 300000);
    return () => clearInterval(intervalId);
  }, []);
  const handleClearAll = () => {
    dispatch(clearPreviousLocations());
  };
  const handleRemoveLocation = (index: number) => {
    dispatch(removePreviousLocation(index));
  };
  const handleNavigation = (location: any) => {
    navigation("/map", {
      state: {
        address: location.address,
        lat: location.latitude,
        lng: location.longitude,
      },
    });
  };
  //console.log(currentLocation);
  return (
    <div className="locationsContainer" data-testid="location-container">
      {location ? (
        <div className="addresses">
          <Typography variant="h4" gutterBottom>
            Current Location
          </Typography>
          <Box
            onClick={() => handleNavigation(currentLocation)}
            sx={{
              cursor: "pointer",
              p: 1.5,
              "&:hover": {
                border: 1,
                borderRadius: 2,
                borderColor: "divider",
                p: 1.5,
              },
            }}
            data-testid="current-location"
          >
            {currentLocation && (
              <Box sx={{ textAlign: "left" }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  {currentLocation.address}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {currentLocation.dateTime}
                </Typography>
              </Box>
            )}
          </Box>
          <Button
            className="clearBtn"
            variant="contained"
            color="success"
            onClick={handleClearAll}
            sx={{ mt: 1 }}
          >
            Clear All Locations
          </Button>

          {previousLocations.length > 0 && (
            <div className="previousLocations">
              <Typography variant="subtitle1">Previous Addresses:</Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  p: 1,
                  border: 1,
                  borderRadius: 2,
                  borderColor: "divider",
                  textAlign: "left",
                }}
                data-testid="previous-locations"
              >
                {previousLocations
                  .slice()
                  .reverse()
                  .map((location: any, index: number) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        gap: 2,
                        cursor: "pointer",
                      }}
                    >
                      <Box
                        onClick={() => handleNavigation(location)}
                        sx={{
                          "&:hover": {
                            border: 1,
                            borderRadius: 2,
                            borderColor: "divider",
                          },
                          p: 1,
                        }}
                      >
                        <Typography
                          sx={{ fontWeight: "bold" }}
                          data-testid={`previous-location-${index + 1}`}
                        >
                          {location?.address}
                        </Typography>
                        <Typography data-testid={`previous-time-${index + 1}`}>
                          {location.dateTime}
                        </Typography>
                      </Box>
                      <Button
                        className="removeBtn"
                        sx={{ height: "80%", mt: 1.5 }}
                        variant="contained"
                        color="success"
                        onClick={() => handleRemoveLocation(index)}
                      >
                        Remove
                      </Button>
                    </Box>
                  ))}
              </Box>
            </div>
          )}
        </div>
      ) : (
        <p>Loading current location...</p>
      )}
    </div>
  );
};

export default Locations;
