import asyncio
import sys
from zstandard import ZstdDecompressor
import json
from asyncio import Semaphore
import math
import os


# Ensure stdout uses UTF-8 encoding
sys.stdout.reconfigure(encoding='utf-8')


class Decoder:
    def __init__(self, semaphore_value: int, target_latitude: float, target_longitude: float, radius_km: float) -> None:
        self.sem = Semaphore(semaphore_value)
        self._raw = []
        self.target_latitude = target_latitude
        self.target_longitude = target_longitude
        self.radius_km = radius_km
        self.total_hotels = total_hotels
        self.buffer = ""
        self.hotel_count = 0
        self.final_hotels = []
        self.final_hotels_Id = []

    def haversine(self, lat1, lon1, lat2, lon2):
        """
        Calculate the great circle distance in kilometers between two points 
        on the earth (specified in decimal degrees)
        """
        # convert decimal degrees to radians
        lon1, lat1, lon2, lat2 = map(math.radians, [lon1, lat1, lon2, lat2])

        # haversine formula
        dlon = lon2 - lon1
        dlat = lat2 - lat1
        a = math.sin(dlat / 2) ** 2 + math.cos(lat1) * \
            math.cos(lat2) * math.sin(dlon / 2) ** 2
        c = 2 * math.asin(math.sqrt(a))
        # Radius of earth in kilometers. Use 3956 for miles. Determines return value units.
        r = 6371
        return c * r

    async def _process_raw_hotels(self) -> None:
        """
        Handles raw lines from the archive.
        Usually, it's the first and the last lines from the chunks.
        """
        raw_hotels = self._raw[1:]
        raw_hotels = [self._raw[0]] + [
            "".join(t) for t in zip(raw_hotels[::2], raw_hotels[1::2])
        ]
        await self._process_hotel(*raw_hotels)

    async def _process_hotel(self, *raw_hotels: str) -> None:
        for h in raw_hotels:
            if self.hotel_count >= self.total_hotels:
                break
            hotel_data = json.loads(h)
            lat = hotel_data.get('latitude')
            lon = hotel_data.get('longitude')
            if lat is not None and lon is not None:
                distance = self.haversine(
                    self.target_latitude, self.target_longitude, lat, lon)
                if distance <= self.radius_km:
                    # self.final_hotels.append(hotel_data['name'])
                    self.final_hotels.append(hotel_data)
                    self.final_hotels_Id.append(hotel_data['id'])
                    self.hotel_count += 1

    async def _process_chunk(self, chunk: bytes) -> None:
        try:
            raw_data = self.buffer + chunk.decode("utf-8", errors="ignore")
            lines = raw_data.split("\n")
            for i, line in enumerate(lines):
                if i == 0 and not self.buffer:
                    self._raw.append(lines[0])
                elif i == len(lines) - 1:
                    self.buffer = lines[-1]
                else:
                    await self._process_hotel(line)
                    if self.hotel_count >= self.total_hotels:
                        return
        except Exception as e:
            print(f"Error processing chunk: {e}")
        finally:
            self.sem.release()

    async def parse_dump(self, filename: str) -> None:
        with open(filename, "rb") as fh:
            dctx = ZstdDecompressor()
            with dctx.stream_reader(fh) as reader:
                while self.hotel_count < self.total_hotels:
                    chunk = reader.read(2 ** 24)
                    if not chunk:
                        await self._process_raw_hotels()
                        break
                    await self.sem.acquire()
                    await self._process_chunk(chunk)

    async def run(self, filename: str) -> None:
        await self.parse_dump(filename)
        # print(json.dumps(self.final_hotels))  # Output final_hotels as JSON
        # output final_hotels and final_hotels_Id as JSON

        final_output = {
            "final_hotels": self.final_hotels,
            "final_hotels_Id": self.final_hotels_Id
        }
        # Output the combined dictionary as JSON
        print(json.dumps(final_output))


if __name__ == "__main__":
    # print("Current Working Directory " , os.getcwd())
    # target_latitude = 30.8920198  # Replace with your target latitude
    # target_longitude = 75.916124  # Replace with your target longitude
    # radius_km = 10  # Radius in kilometers

    current_directory = os.path.dirname(os.path.abspath(__file__))

    # print("Current Working Directory " , current_directory)

    #relative_path = os.path.join(current_directory, "controller", "partner_feed_en_v3.jsonl.zst") # for local testing
    relative_path = os.path.join(current_directory, "partner_feed_en_v3.jsonl.zst") # for production

    print("Relative Path: ", relative_path)

    # Retrieve latitude, longitude, and total hotels from command-line arguments
    if len(sys.argv) != 4:
        print("Usage: python main.py <latitude> <longitude> <total_hotels>")
        sys.exit(1)

    try:
        target_latitude = float(sys.argv[1])
        target_longitude = float(sys.argv[2])
        total_hotels = int(sys.argv[3])
    except ValueError as e:
        print(f"Invalid argument format: {e}")
        sys.exit(1)

    radius_km = 10  # Radius in kilometers

    # loop = asyncio.get_event_loop()
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    d = Decoder(semaphore_value=10, target_latitude=target_latitude,
                target_longitude=target_longitude, radius_km=radius_km)
    
    # Replace the file path with the path to the JSONL.ZST file
    # loop.run_until_complete(d.run(r"C:\Users\Rajnish Tripathi\Desktop\QUADB\NODE\RentSpace-Node\controller\partner_feed_en_v3.jsonl.zst")) 
    loop.run_until_complete(d.run(relative_path)) 
    
