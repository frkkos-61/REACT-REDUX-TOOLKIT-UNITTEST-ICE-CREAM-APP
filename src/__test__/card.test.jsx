import { fireEvent, render, screen } from "@testing-library/react";
import Card from "../components/list/card";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";

//* useDispatch'ı mockla
jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
}));

describe("Card bileşeni testleri", () => {
  //* useDispatch'ın döndürdüğü dispatch methodunu mockla
  const dispatchMock = jest.fn();

  const mockItem = {
    name: "Bal Badem",
    image: "/ice-2.png",
    price: 25,
    id: "354b",
  };

  //* Her test öncesinde sahte useDispatch çağrıldığında return etsin
  beforeAll(() => {
    useDispatch.mockReturnValue(dispatchMock);
  });

  //* Her test sonrasında bütün mockları sıfırla
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("İtem detaylarını doğru şekilde renderlar", () => {
    render(<Card item={mockItem} />);
    screen.getByRole("heading", { name: "Bal Badem" });
    screen.getByText("₺25 / top");
    expect(screen.getByRole("img")).toHaveAttribute("src", "/ice-2.png");
  });

  it("Tipin seçili olma durumuna göre 'Sepete Ekle' butonunun görünürlüğü değişir", () => {
    //* Card bileşenini renderla
    render(<Card item={mockItem} />);

    //* Sepete ekle butonunu al
    const cartBtn = screen.getByRole("button", { name: /sepete/i });

    //* Sepete ekle butonu görünmezdir
    expect(cartBtn).toHaveClass("invisible");

    //*Külahta butonunu al
    const typeBtn = screen.getByRole("button", { name: /külahta/i });

    //* Külahta butonuna tıkla
    fireEvent.click(typeBtn);

    //* Sepete ekle butonu görünmezdir
    expect(cartBtn).not.toHaveClass("invisible");
  });

  it("Sepete ekle butonuna tıklanınca Reducar'a haber verir", () => {
    //* Bileşeni renderla
    render(<Card item={mockItem} />);

    //* Bardakta seçeneğini seç
    const typeBtn = screen.getByRole("button", { name: /bardakta/i });
    fireEvent.click(typeBtn);

    //* Sepete ekle butonuna tıkla
    const cartBtn = screen.getByRole("button", { name: /sepete/i });
    fireEvent.click(cartBtn);

    //* Dispatch methodu doğru parametreler ile çalıştı mı?
    expect(dispatchMock).toHaveBeenCalledWith(
      addToCart({ item: mockItem, selectedType: "cup" })
    );
  });
});
