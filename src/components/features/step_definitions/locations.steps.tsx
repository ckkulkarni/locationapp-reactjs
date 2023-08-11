import React from "react";
import { defineFeature, loadFeature } from "jest-cucumber";
import { fireEvent, render, waitFor, act } from "@testing-library/react";
import "text-encoding";
import "@testing-library/jest-dom/extend-expect";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import locationSlice, {
  addPreviousLocation,
  clearPreviousLocations,
  removePreviousLocation,
  setCurrentLocation,
} from "./../../reducers/reducer/locationSlice";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  MemoryRouter,
  useNavigate,
} from "react-router-dom";
import Locations from "../../Locations";
import Map from "../../Map";
import axios from "axios";
jest.mock("axios");
const feature = loadFeature("src/components/features/locations.feature");
defineFeature(feature, (test) => {
  test("Displaying Current Location", ({ given, when, then, and }) => {
    jest.setTimeout(50000);
    const store = configureStore({
      reducer: {
        locationList: locationSlice,
      },
    });
    const mockPosition = {
      coords: {
        latitude: 37.7749,
        longitude: -122.4194,
      },
    };
    const mockAddressResponse = {
      data: {
        results: [
          {
            formatted_address: "123 Street, Hyd",
          },
        ],
      },
    };

    (axios.get as jest.Mock).mockResolvedValueOnce(mockAddressResponse);
    const mockGeolocation = {
      getCurrentPosition: jest.fn((successCallback) => {
        successCallback(mockPosition);
      }),
    };

    Object.defineProperty(global.navigator, "geolocation", {
      value: mockGeolocation,
      configurable: true,
    });

    const screen = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route path="/" element={<Locations />} />
            <Route path="/map" element={<Map />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    given("the user is on the Locations page", async () => {
      await waitFor(() => {
        expect(screen).toBeDefined();
        const locationsContainer = screen.getByTestId("location-container");
        expect(locationsContainer).toBeInTheDocument();
      });
    });
    when("the page loads", () => {
      expect(screen).toBeDefined();
    });
    then("the user should see Current Location address", () => {
      expect(screen.getByText("Current Location")).toBeInTheDocument();
      expect(screen.getByText("123 Street, Hyd")).toBeInTheDocument();
    });
    and("the user should see the date and time of the current location", () => {
      const currentDateTime = new Date().toLocaleString();
      expect(screen.getByText(currentDateTime)).toBeInTheDocument();
    });
    and('the user should see a "Clear All Locations" button', () => {
      const clearAllButton = screen.getByRole("button", {
        name: "Clear All Locations",
      });
      expect(clearAllButton).toBeInTheDocument();
    });
    and(
      "the user should see a list of previous addresses after a set interval of time",
      async () => {
        jest.useFakeTimers();
        const address = mockAddressResponse.data.results[0].formatted_address;
        const latitude = mockPosition.coords.latitude;
        const longitude = mockPosition.coords.longitude;
        const dateTime = new Date().toLocaleString();
        act(() => {
          store.dispatch(
            addPreviousLocation({ address, latitude, longitude, dateTime })
          );
        });
        jest.advanceTimersByTime(300000);
        await screen.findByTestId("previous-locations");
      }
    );
    and("each previous address should display the address", async () => {
      const previousLocation1 = await screen.findByTestId(
        "previous-location-1"
      );
      expect(previousLocation1).toHaveTextContent("123 Street, Hyd");
    });
    and(
      "each previous address should display the date and time of that location",
      async () => {
        const previoustime1 = await screen.findByTestId("previous-time-1");
        const currentDateTime = new Date();
        const previousDateTime = new Date(currentDateTime.getTime() - 300000);
        const dateTime = previousDateTime.toLocaleString();
        expect(previoustime1).toHaveTextContent(dateTime);
      }
    );
    when(
      'the user clicks the "Remove" button, it removes that previous address',
      async () => {
        const address = mockAddressResponse.data.results[0].formatted_address;
        const latitude = mockPosition.coords.latitude;
        const longitude = mockPosition.coords.longitude;
        const dateTime = new Date().toLocaleString();
        jest.useFakeTimers();
        act(() => {
          store.dispatch(
            addPreviousLocation({ address, latitude, longitude, dateTime })
          );
        });
        jest.advanceTimersByTime(300000);
        const previousLocation2 = screen.getByTestId("previous-location-2");
        expect(previousLocation2).toBeDefined();
        const removeButton2 = screen.getAllByRole("button", { name: "Remove" });
        fireEvent.click(removeButton2[1]);
        expect(previousLocation2).not.toBeInTheDocument();
      }
    );
    when(
      'the user clicks the "Clear All Locations" button, it removes all addresses',
      () => {
        const clearAllButton = screen.getByRole("button", {
          name: "Clear All Locations",
        });
        const previousLocations = screen.getByTestId("previous-locations");
        expect(clearAllButton).toBeInTheDocument();
        expect(previousLocations).toBeInTheDocument();
        act(() => {
          fireEvent.click(clearAllButton);
        });
        expect(previousLocations).not.toBeInTheDocument();
      }
    );
    when("the user clicks on the current location address", async () => {
      expect(screen.getByText("123 Street, Hyd")).toBeInTheDocument();
      const currentLocation = screen.getByTestId("current-location");
      expect(currentLocation).toBeDefined();
      fireEvent.click(currentLocation);
    });
    then("the user should be navigated to the map page", async () => {
      const mapContainer = screen.getByTestId("map-container");
      expect(mapContainer).toBeDefined();
    });
  });
});
