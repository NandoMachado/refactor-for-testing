import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import App from "./App";

describe("App", () => {
  it("renders headings and button", () => {
    render(<App />);

    expect(screen.getByText("Business Name")).toBeVisible();
    expect(screen.getByText("Business Rate")).toBeVisible();
    expect(screen.getByRole("button", { name: "Reveal Offer" })).toBeVisible();
  });

  describe("when no props are provided", () => {
    it("renders empty business name and undefined business rate", () => {
      render(<App />);

      const cards = screen.getAllByTestId("card");
      expect(cards[0]).toBeEmptyDOMElement(); // business name card
      expect(cards[1]).toBeEmptyDOMElement(); // business rate card
    });

    it("does not show special offer even after revealing", async () => {
      render(<App />);

      const button = screen.getByRole("button", { name: "Reveal Offer" });
      await userEvent.click(button);

      expect(
        screen.queryByText("You have a special business offer!"),
      ).not.toBeInTheDocument();
    });

    it("renders undefined final rate", () => {
      const { container } = render(<App />);
      const divs = container.querySelectorAll("div");
      const finalRateDiv = Array.from(divs).find(
        (div) => !div.className && div.textContent === "",
      );
      expect(finalRateDiv).toBeInTheDocument();
    });
  });

  describe("when only businessName is provided", () => {
    it("renders Nandos with rate 10", () => {
      render(<App businessName="Nandos" />);

      expect(screen.getByText("Nandos")).toBeVisible();
      expect(screen.getAllByText("10")).toHaveLength(2); // business rate and final rate
    });

    it("renders McDonalds with rate 15", () => {
      render(<App businessName="McDonalds" />);

      expect(screen.getByText("McDonalds")).toBeVisible();
      expect(screen.getAllByText("15")).toHaveLength(2);
    });

    it("renders other business with rate 20", () => {
      render(<App businessName="Some Other Business" />);

      expect(screen.getByText("Some Other Business")).toBeVisible();
      expect(screen.getAllByText("20")).toHaveLength(2);
    });

    it("shows special offer for Nandos after clicking reveal button", async () => {
      render(<App businessName="Nandos" />);

      expect(
        screen.queryByText("You have a special business offer!"),
      ).not.toBeInTheDocument();

      const button = screen.getByRole("button", { name: "Reveal Offer" });
      await userEvent.click(button);

      expect(
        screen.getByText("You have a special business offer!"),
      ).toBeVisible();
    });

    it("shows special offer for McDonalds after clicking reveal button", async () => {
      render(<App businessName="McDonalds" />);

      expect(
        screen.queryByText("You have a special business offer!"),
      ).not.toBeInTheDocument();

      const button = screen.getByRole("button", { name: "Reveal Offer" });
      await userEvent.click(button);

      expect(
        screen.getByText("You have a special business offer!"),
      ).toBeVisible();
    });

    it("does not show special offer for other business after clicking reveal button", async () => {
      render(<App businessName="Some Other Business" />);

      const button = screen.getByRole("button", { name: "Reveal Offer" });
      await userEvent.click(button);

      expect(
        screen.queryByText("You have a special business offer!"),
      ).not.toBeInTheDocument();
    });
  });

  describe("when only discountRate is provided", () => {
    it("renders empty business name and undefined rates with discountRate alone", () => {
      render(<App discountRate={10} />);

      const cards = screen.getAllByTestId("card");
      expect(cards[0]).toBeEmptyDOMElement(); // business name card
      expect(cards[1]).toBeEmptyDOMElement(); // business rate card
    });

    it("does not show special offer with discountRate alone", async () => {
      render(<App discountRate={20} />);

      const button = screen.getByRole("button", { name: "Reveal Offer" });
      await userEvent.click(button);

      expect(
        screen.queryByText("You have a special business offer!"),
      ).not.toBeInTheDocument();
    });
  });

  describe("when both businessName and discountRate are provided", () => {
    it("calculates final rate for Nandos with 10% discount", () => {
      render(<App businessName="Nandos" discountRate={10} />);

      expect(screen.getByText("Nandos")).toBeVisible();
      expect(screen.getByText("10")).toBeVisible(); // business rate
      expect(screen.getByText("9")).toBeVisible(); // final rate: 10 - (10 * 10 / 100) = 9
    });

    it("calculates final rate for Nandos with 50% discount", () => {
      render(<App businessName="Nandos" discountRate={50} />);

      expect(screen.getByText("Nandos")).toBeVisible();
      expect(screen.getByText("10")).toBeVisible(); // business rate
      expect(screen.getByText("5")).toBeVisible(); // final rate: 10 - (10 * 50 / 100) = 5
    });

    it("calculates final rate for McDonalds with 10% discount", () => {
      render(<App businessName="McDonalds" discountRate={10} />);

      expect(screen.getByText("McDonalds")).toBeVisible();
      expect(screen.getByText("15")).toBeVisible(); // business rate
      expect(screen.getByText("13.5")).toBeVisible(); // final rate: 15 - (15 * 10 / 100) = 13.5
    });

    it("calculates final rate for McDonalds with 20% discount", () => {
      render(<App businessName="McDonalds" discountRate={20} />);

      expect(screen.getByText("McDonalds")).toBeVisible();
      expect(screen.getByText("15")).toBeVisible(); // business rate
      expect(screen.getByText("12")).toBeVisible(); // final rate: 15 - (15 * 20 / 100) = 12
    });

    it("calculates final rate for other business with 10% discount", () => {
      render(<App businessName="Some Other Business" discountRate={10} />);

      expect(screen.getByText("Some Other Business")).toBeVisible();
      expect(screen.getByText("20")).toBeVisible(); // business rate
      expect(screen.getByText("18")).toBeVisible(); // final rate: 20 - (20 * 10 / 100) = 18
    });

    it("calculates final rate for other business with 25% discount", () => {
      render(<App businessName="Another Business" discountRate={25} />);

      expect(screen.getByText("Another Business")).toBeVisible();
      expect(screen.getByText("20")).toBeVisible(); // business rate
      expect(screen.getByText("15")).toBeVisible(); // final rate: 20 - (20 * 25 / 100) = 15
    });

    it("shows special offer for Nandos with discount after clicking reveal button", async () => {
      render(<App businessName="Nandos" discountRate={10} />);

      const button = screen.getByRole("button", { name: "Reveal Offer" });
      await userEvent.click(button);

      expect(
        screen.getByText("You have a special business offer!"),
      ).toBeVisible();
    });

    it("shows special offer for McDonalds with discount after clicking reveal button", async () => {
      render(<App businessName="McDonalds" discountRate={15} />);

      const button = screen.getByRole("button", { name: "Reveal Offer" });
      await userEvent.click(button);

      expect(
        screen.getByText("You have a special business offer!"),
      ).toBeVisible();
    });

    it("does not show special offer for other business with discount after clicking reveal button", async () => {
      render(<App businessName="Regular Business" discountRate={10} />);

      const button = screen.getByRole("button", { name: "Reveal Offer" });
      await userEvent.click(button);

      expect(
        screen.queryByText("You have a special business offer!"),
      ).not.toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("handles 0% discount rate", () => {
      render(<App businessName="Nandos" discountRate={0} />);

      expect(screen.getAllByText("10")).toHaveLength(2); // both business rate and final rate are 10
    });

    it("handles 100% discount rate", () => {
      render(<App businessName="Nandos" discountRate={100} />);

      expect(screen.getByText("10")).toBeVisible(); // business rate
      expect(screen.getByText("0")).toBeVisible(); // final rate: 10 - (10 * 100 / 100) = 0
    });
  });
});
