Feature: Displaying Current and Previous Locations

    Scenario: Displaying Current Location
        Given the user is on the Locations page
        When the page loads
        Then the user should see Current Location address
        And the user should see the date and time of the current location
        And the user should see a "Clear All Locations" button
        And the user should see a list of previous addresses after a set interval of time
        And each previous address should display the address
        And each previous address should display the date and time of that location
        When the user clicks the "Remove" button, it removes that previous address
        When the user clicks the "Clear All Locations" button, it removes all addresses
        When the user clicks on the current location address
        Then the user should be navigated to the map page



# Scenario: Displaying Previous Locations
#     Given the user is on the Locations page
#     When the page loads

# Scenario: Navigating to Map
#     Given the user is on the Locations page
#     And the map page should display the selected address

# Scenario: Removing a Previous Location
#     Given the user is on the Locations page


