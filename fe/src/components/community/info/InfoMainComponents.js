import { useEffect, useRef, useState } from 'react';
import { getJobs } from '../../api/community/JobAPi';

const InfoMainComponents = () => {
    const mapContainer = useRef(null);
    const [keyword, setKeyword] = useState('java');
    const [places, setPlaces] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [map, setMap] = useState(null);
    const [infowindow, setInfowindow] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [selectedData, setSelectedData] = useState({
        title: '위치를 클릭해주세요', // 공고 제목
        companyName: '', // 기업명
        location: '', // 위치
        salary: '', // 연봉
        applyUrl: '', // 지원 URL
        employmentType: '', // 고용 형태
        experienceRequired: '', // 경력 요구 사항
        jobLevel: '', // 직급
        postedDate: '', // 게시일
        closingDate: '', // 마감일
        experienceLevel: '', // 경력 수준
        requiredEducationLevel: '', // 학력 요구 사항
        keywords: '', // 키워드
        readCnt: '', // 조회수
        applyCnt: '', // 지원자 수
        jobMidCode: '', // 상위 직무 코드
        jobCode: '', // 직무 코드
        industry: '', // 업종
    });

    const [jobData, setJobData] = useState([]);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=74a8d06a8248ca1397d3f95dd9185ff8&libraries=services`;
        script.async = true;
        script.onload = initializeMap;
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    useEffect(() => {
        if (jobData.length > 0) {
            displayPlaces(jobData);
        }
    }, [jobData, map]);

    const initializeMap = () => {
        if (!window.kakao) return;

        const kakao = window.kakao;
        const mapOption = {
            center: new kakao.maps.LatLng(37.350205, 127.108784),
            level: 3,
        };

        const newMap = new kakao.maps.Map(mapContainer.current, mapOption);
        setMap(newMap);

        const newInfowindow = new kakao.maps.InfoWindow({ zIndex: 1 });
        setInfowindow(newInfowindow);
    };

    const fetchJobData = async () => {
        try {
            const data = await getJobs(keyword);
            const updatedJobData = await Promise.all(data.map(async (job) => {
                const coordinates = await fetchCoordinates(job.companyName);
                return {
                    ...job,
                    latitude: coordinates ? coordinates.latitude : null,
                    longitude: coordinates ? coordinates.longitude : null,
                };
            }));
            setJobData(updatedJobData);
        } catch (error) {
            console.error('Error fetching job data:', error);
        }
    };

    const fetchCoordinates = async (companyName) => {
        return new Promise((resolve) => {
            const kakao = window.kakao;
            const ps = new kakao.maps.services.Places();
            ps.keywordSearch(companyName, (data, status) => {
                if (status === kakao.maps.services.Status.OK && data[0]) {
                    const { y: latitude, x: longitude } = data[0];
                    resolve({ latitude, longitude });
                } else {
                    resolve({ latitude: 0, longitude: 0 });
                }
            });
        });
    };

    const searchPlaces = () => {
        if (!keyword.trim()) {
            alert('Please enter a keyword!');
            return;
        }
        fetchJobData();
    };

    const displayPlaces = (places) => {
        if (!map) return;

        const kakao = window.kakao;
        const bounds = new kakao.maps.LatLngBounds();
        removeMarkers();

        const newMarkers = places
            .filter(place => place.latitude && place.longitude)
            .map((place, i) => {
                const position = new kakao.maps.LatLng(place.latitude, place.longitude);
                const marker = addMarker(position, i);
                bounds.extend(position);

                kakao.maps.event.addListener(marker, 'mouseover', () => displayInfowindow(marker, place.title));
                kakao.maps.event.addListener(marker, 'mouseout', () => infowindow.close());

                kakao.maps.event.addListener(marker, 'click', () => setSelectedData(place));

                return marker;
            });

        setMarkers(newMarkers);
        map.setBounds(bounds);
    };

    const addMarker = (position, idx) => {
        const kakao = window.kakao;
        const imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png';

        // 이미지 크기를 크게 설정하여 클릭 범위 확장
        const imageSize = new kakao.maps.Size(50, 50); // 마커 이미지 크기를 50x50으로 확대
        const imgOptions = {
            spriteSize: new kakao.maps.Size(36, 691),
            spriteOrigin: new kakao.maps.Point(0, idx * 46 + 10),
            offset: new kakao.maps.Point(25, 50) // 마커 이미지의 중심에 맞게 조정
        };

        const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions);

        const marker = new kakao.maps.Marker({
            position,
            image: markerImage
        });

        marker.setMap(map);
        return marker;
    };

    const removeMarkers = () => {
        markers.forEach((marker) => marker.setMap(null));
        setMarkers([]);
    };

    const displayInfowindow = (marker, title) => {
        infowindow.setContent(`<div style="padding:5px;z-index:1;">${title}</div>`);
        infowindow.open(map, marker);
    };

    const handleKeywordChange = (e) => setKeyword(e.target.value);

    return (
        <div className="flex flex-wrap">
            <div className="map_wrap w-full md:w-1/2 p-2 mt-6">
                <div ref={mapContainer} style={{ width: '100%', height: '500px', position: 'relative', overflow: 'hidden' }}></div>
                <div id="menu_wrap" className="bg_white mt-4 p-4 rounded-lg shadow-lg">
                    <div className="option">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                searchPlaces();
                            }}
                            className="flex items-center space-x-4"
                        >
                            <label className="text-lg font-semibold text-gray-700">
                                Keyword:
                                <input
                                    type="text"
                                    value={keyword}
                                    onChange={handleKeywordChange}
                                    className="ml-2 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
                                    placeholder="Search keyword"
                                />
                            </label>
                            <button
                                type="submit"
                                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all"
                            >
                                Search
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="p-5 w-full md:w-1/2 overflow-y-auto">
                <div className="bg-blue-500 text-white p-4 rounded-lg mb-6">
                    <h3 className="text-2xl font-semibold">{selectedData.title}</h3>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-green-100 p-4 rounded-lg shadow-md">
                            <p className="text-lg text-green-600 font-bold">회사명</p>
                            <p className="text-gray-800">{selectedData.companyName}</p>
                        </div>
                        <div className="bg-green-100 p-4 rounded-lg shadow-md">
                            <p className="text-lg text-green-600 font-bold">위치</p>
                            <p className="text-gray-800">{selectedData.location.replaceAll("&gt;", "> ")}</p>
                        </div>
                        <div className="bg-green-100 p-4 rounded-lg shadow-md">
                            <p className="text-lg text-green-600 font-bold">연봉</p>
                            <p className="text-gray-800">{selectedData.salary}</p>
                        </div>
                        <div className="bg-green-100 p-4 rounded-lg shadow-md">
                            <p className="text-lg text-green-600 font-bold">근무 형태</p>
                            <p className="text-gray-800">{selectedData.jobMidCode}</p>
                        </div>
                        <div className="bg-green-100 p-4 rounded-lg shadow-md">
                            <p className="text-lg text-green-600 font-bold">경력 요구 사항</p>
                            <p className="text-gray-800">{selectedData.requiredEducationLevel}</p>
                        </div>
                        <div className="bg-green-100 p-4 rounded-lg shadow-md">
                            <p className="text-lg text-green-600 font-bold">직급</p>
                            <p className="text-gray-800">면접 후 결정</p>
                        </div>
                    </div>
                    <a href={selectedData.url} className="mt-6 inline-block bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-all" target="_blank" rel="noopener noreferrer">상세 정보 보러가기</a>
                </div>
            </div>
        </div>
    );
};

export default InfoMainComponents;
