import List from "../components/list/index";
import { render, screen, waitFor } from "@testing-library/react";
import api from "../utils/api";
import Card from "../components/list/card";
import { mockArray } from "../utils/constants";

//* API modulünü mock'la
jest.mock("../utils/api");

//* Card.jsx bileşeni içerisinde Provider/Router gibi bağımlıklıklar kullanıldığından ve bu bağımlılıkların list bileşinine etki etmemesini istediğimizden Card bileşinini mock'la
jest.mock("../components/list/card");

describe("List bileşeni testleri", () => {
  //* Önceden mock'lanan test verilerinin API' a aktarılan güncellemelerini temizle
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Veri çekilirken ekranda loader vardır", async () => {
    //* Bu test içerisinde 'api.get' isteği atıldığında olumlu cevap gitsin
    api.get.mockResolvedValueOnce({ data: [] });

    //* List bileşenini renderla
    render(<List />);

    //* Ekranda loader vardır
    screen.getByTestId("list-loader");

    //* Belirli bir süre sonra ekrandan loader gider
    await waitFor(() => {
      expect(screen.queryByTestId("list-loader")).toBeNull();
    });
  });

  it("API'dan error  cevabı gelirse ekrana hata mesajı gelir", async () => {
    //* Bu test içerisinde 'api.get' isteği atıldığında olumsuz cevap gitsin
    const errMsg = "bağlantı zaman aşımını uğradı";
    api.get.mockRejectedValueOnce(new Error(errMsg));

    //* List bileşenini renderla
    render(<List />);

    //* API'dan cevap gelince ekrana hata component'i gelir
    await waitFor(() => screen.getByTestId("list-error"));
  });

  it("api'dan başarılı cevap gelirse ekrana card'lar gelir", async () => {
    // * Card component'ı çağrılınca ne return etmeli
    Card.mockImplementation(({ item }) => <div>{item.name}</div>);

    //* Bu test içerisinde 'api.get' isteği atılduğında olumlu cevap gitsin
    api.get.mockResolvedValueOnce({ data: mockArray });
    //* Bileşeni renderla
    render(<List />);

    //* Veri gelince dizideki her bir nesne için ekrana kart gelir
    await waitFor(() => {
      mockArray.forEach((item) => {
        screen.getByText(item.name);
      });
    });
  });
});
