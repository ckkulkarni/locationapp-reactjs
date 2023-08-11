import React from "react";
import { defineFeature, loadFeature } from "jest-cucumber";
import { fireEvent, render, waitFor, act } from "@testing-library/react";
import "text-encoding";
import "@testing-library/jest-dom/extend-expect";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  MemoryRouter,
} from "react-router-dom";
import Locations from "../../Locations";
import Map from "../../Map";
const feature = loadFeature("src/components/features/map.feature");

defineFeature(feature, (test) => {
  test("Viewing Location on the Map", ({ given, when, then, and }) => {
    const locationState = {
      lat: 37.7749,
      lng: -122.4194,
      address: "123 Street, Hyd",
    };
    const screen = render(
      <MemoryRouter
        initialEntries={[{ pathname: "/map", state: locationState }]}
      >
        <Map />
      </MemoryRouter>
    );
    given("the user is on the Map page", () => {
      const mapContainer = screen.getByTestId("map-container");
      expect(mapContainer).toBeInTheDocument();
    });

    when(
      "the user should see the address of the location that will be displayed in the map",
      () => {
        const addressContainer = screen.getByText("123 Street, Hyd");
        expect(addressContainer).toBeInTheDocument();
      }
    );
    and(
      "the user should see a marker indicating the specified location",
      () => {
        const marker = screen.getByAltText("Marker");
        expect(marker).toBeInTheDocument();
      }
    );

    and("the user should see the map rendered correclty", () => {
      const mapContainer = screen.getAllByRole("img");
      expect(mapContainer[0]).toBeDefined();
    });
  });
});
