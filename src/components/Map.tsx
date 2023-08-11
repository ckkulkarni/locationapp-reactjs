import React, { useState } from "react";
import { useLocation } from "react-router";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { Box, Typography } from "@mui/material";

const Map = () => {
  const location = useLocation();
  const { lat, lng, address } = location.state;

  return (
    <div className="locationsContainer" data-testid="map-container">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100%",
          gap: 2,
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
          {address}
        </Typography>
        <Box>
          <MapContainer
            center={[lat, lng]}
            zoom={15}
            style={{ height: "500px", width: "100%", borderRadius: "32px" }}
            data-testid="leaflet-map"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[lat, lng]}></Marker>
          </MapContainer>
        </Box>
      </Box>
    </div>
  );
};

export default Map;
