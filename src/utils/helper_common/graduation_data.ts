
interface GraduationOption {
    label: string;
    value: string;
};

// input: none
// output: graduation data
export function getGraduationData() {

    
    return generateGraduationOptions();
}

const generateGraduationOptions = (): GraduationOption[] => {
    const options: GraduationOption[] = [];
    const today = new Date();
    const startYear = today.getFullYear();
    const startMonth = today.getMonth();
    const startDate = today.getDate();

    const seasons = ['Spring', 'Summer', 'Fall', 'Winter'] as const;
    const seasonsnosummer = ['Spring', 'Fall', 'Winter'] as const;

    let startSeason: typeof seasonsnosummer[number];
    if ((startMonth === 0 && startDate <= 15) || (startMonth === 1) || (startMonth === 2 && startDate < 28)) {
        startSeason = 'Spring';
    } else if ((startMonth === 2 && startDate >= 28) || (startMonth === 3) || (startMonth === 4 && startDate < 28)) {
        startSeason = 'Fall';
    } else if ((startMonth === 4 && startDate >= 28) || (startMonth === 5) || (startMonth === 6 && startDate < 15)) {
        startSeason = 'Fall';
    } else {
        startSeason = 'Winter';
    }

    // 시즌 순서 찾기
    const startIndex = seasonsnosummer.indexOf(startSeason);

    // 4년 동안의 옵션 생성
    for (let yearOffset = 0; yearOffset < 4; yearOffset++) {
      for (let seasonOffset = 0; seasonOffset < 3; seasonOffset++) {
          const year = startYear + yearOffset;
          const seasonIndex = (startIndex + seasonOffset) % seasonsnosummer.length;
          options.push({
              label: `${seasonsnosummer[seasonIndex]} ${year}`,
              value: `${seasonsnosummer[seasonIndex].toLowerCase()} ${year}`
          });
      }
    }

    return options;
  };