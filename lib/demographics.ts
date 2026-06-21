import { createClient } from "@/utils/supabase/client";
import { DemographicData } from "@/types";

export interface VillageStats {
  population: string;
  households: string;
  rtCount: number;
  rwCount: number;
  areaSize: string;
}

export interface ReligionStat {
  name: string;
  count: number;
  percentage: string;
}

const defaultVillageStats: VillageStats = {
  population: "4.826 jiwa",
  households: "1.392 KK",
  rtCount: 24,
  rwCount: 8,
  areaSize: "425 Ha",
};

const defaultReligionStats: ReligionStat[] = [
  { name: "Islam", count: 4792, percentage: "99.3%" },
  { name: "Kristen Protestan", count: 24, percentage: "0.5%" },
  { name: "Katolik", count: 10, percentage: "0.2%" },
  { name: "Hindu", count: 0, percentage: "0.0%" },
  { name: "Buddha", count: 0, percentage: "0.0%" },
  { name: "Konghucu", count: 0, percentage: "0.0%" },
];

const defaultDemographicStats: DemographicData = {
  gender: [
    { name: "Laki-laki", value: 2431, percentage: "50.4%" },
    { name: "Perempuan", value: 2395, percentage: "49.6%" }
  ],
  education: [
    { level: "Tidak Sekolah", count: 266 },
    { level: "SD/Sederajat", count: 1520 },
    { level: "SMP/Sederajat", count: 1240 },
    { level: "SMA/Sederajat", count: 1410 },
    { level: "Diploma (D1-D4)", count: 180 },
    { level: "Sarjana (S1-S3)", count: 210 }
  ],
  job: [
    { title: "Petani / Kebun", count: 1650 },
    { title: "Karyawan Swasta", count: 1220 },
    { title: "Wiraswasta / UMKM", count: 880 },
    { title: "PNS / TNI / POLRI", count: 120 },
    { title: "Pelajar / Mahasiswa", count: 730 },
    { title: "Belum / Tidak Bekerja", count: 226 }
  ],
  ageGroup: [
    { range: "0 - 5 tahun", count: 390 },
    { range: "6 - 12 tahun", count: 530 },
    { range: "13 - 18 tahun", count: 480 },
    { range: "19 - 35 tahun", count: 1450 },
    { range: "36 - 50 tahun", count: 1190 },
    { range: "51 - 65 tahun", count: 610 },
    { range: "66+ tahun", count: 176 }
  ]
};

export async function getVillageStats(): Promise<VillageStats> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from("village_profile").select("*").maybeSingle();
    if (error || !data) {
      return defaultVillageStats;
    }
    return {
      population: `${data.population_total.toLocaleString("id-ID")} jiwa`,
      households: `${data.family_total.toLocaleString("id-ID")} KK`,
      rtCount: data.rt_total || 24,
      rwCount: data.rw_total || 8,
      areaSize: data.area_size || "425 Ha",
    };
  } catch (e) {
    console.error(e);
    return defaultVillageStats;
  }
}

export async function saveVillageStats(stats: VillageStats) {
  try {
    const supabase = createClient();
    const popVal = parseInt(stats.population.replace(/[^0-9]/g, "")) || 0;
    const famVal = parseInt(stats.households.replace(/[^0-9]/g, "")) || 0;
    
    const { data: profile } = await supabase.from("village_profile").select("id").maybeSingle();
    if (profile) {
      await supabase.from("village_profile").update({
        population_total: popVal,
        family_total: famVal,
        rt_total: stats.rtCount,
        rw_total: stats.rwCount,
        area_size: stats.areaSize,
        updated_at: new Date().toISOString()
      }).eq("id", profile.id);
    }
  } catch (e) {
    console.error(e);
  }
}

export async function getDemographicStats(): Promise<DemographicData> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("demographics")
      .select("*")
      .order("sort_order", { ascending: true });
      
    if (error || !data || data.length === 0) {
      return defaultDemographicStats;
    }
    
    const gender = data
      .filter(d => d.type === "gender")
      .map(d => ({ name: d.label, value: d.value, percentage: "" }));
    
    const totalGender = gender.reduce((sum, g) => sum + g.value, 0);
    gender.forEach(g => {
      const pct = totalGender > 0 ? (g.value / totalGender) * 100 : 0;
      g.percentage = `${pct.toFixed(1)}%`;
    });

    const education = data
      .filter(d => d.type === "education")
      .map(d => ({ level: d.label, count: d.value }));
      
    const job = data
      .filter(d => d.type === "job")
      .map(d => ({ title: d.label, count: d.value }));
      
    const ageGroup = data
      .filter(d => d.type === "age_group" || d.type === "ageGroup")
      .map(d => ({ range: d.label, count: d.value }));

    return { gender, education, job, ageGroup };
  } catch (e) {
    console.error(e);
    return defaultDemographicStats;
  }
}

export async function saveDemographicStats(stats: DemographicData) {
  try {
    const supabase = createClient();
    
    // Upsert gender
    for (let i = 0; i < stats.gender.length; i++) {
      const g = stats.gender[i];
      const { data: existing } = await supabase
        .from("demographics")
        .select("id")
        .eq("type", "gender")
        .eq("label", g.name)
        .maybeSingle();
        
      if (existing) {
        await supabase.from("demographics").update({ value: g.value }).eq("id", existing.id);
      } else {
        await supabase.from("demographics").insert({
          type: "gender",
          label: g.name,
          value: g.value,
          sort_order: i + 1
        });
      }
    }

    // Sync education
    await supabase.from("demographics").delete().eq("type", "education");
    if (stats.education.length > 0) {
      await supabase.from("demographics").insert(
        stats.education.map((e, idx) => ({
          type: "education",
          label: e.level,
          value: e.count,
          sort_order: idx + 1
        }))
      );
    }

    // Sync job
    await supabase.from("demographics").delete().eq("type", "job");
    if (stats.job.length > 0) {
      await supabase.from("demographics").insert(
        stats.job.map((j, idx) => ({
          type: "job",
          label: j.title,
          value: j.count,
          sort_order: idx + 1
        }))
      );
    }

    // Sync age group
    await supabase.from("demographics").delete().eq("type", "age_group");
    if (stats.ageGroup.length > 0) {
      await supabase.from("demographics").insert(
        stats.ageGroup.map((a, idx) => ({
          type: "age_group",
          label: a.range,
          value: a.count,
          sort_order: idx + 1
        }))
      );
    }
  } catch (e) {
    console.error(e);
  }
}

export async function getReligionStats(): Promise<ReligionStat[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("demographics")
      .select("*")
      .eq("type", "religion")
      .order("sort_order", { ascending: true });
      
    if (error || !data || data.length === 0) {
      return defaultReligionStats;
    }
    
    const total = data.reduce((sum, r) => sum + r.value, 0);
    return data.map(d => {
      const pct = total > 0 ? (d.value / total) * 100 : 0;
      return {
        name: d.label,
        count: d.value,
        percentage: `${pct.toFixed(1)}%`
      };
    });
  } catch (e) {
    console.error(e);
    return defaultReligionStats;
  }
}

export async function saveReligionStats(stats: ReligionStat[]) {
  try {
    const supabase = createClient();
    await supabase.from("demographics").delete().eq("type", "religion");
    if (stats.length > 0) {
      await supabase.from("demographics").insert(
        stats.map((r, idx) => ({
          type: "religion",
          label: r.name,
          value: r.count,
          sort_order: idx + 1
        }))
      );
    }
  } catch (e) {
    console.error(e);
  }
}

export async function resetAllStats() {
  try {
    const supabase = createClient();
    
    // Reset village profile
    const { data: profile } = await supabase.from("village_profile").select("id").maybeSingle();
    if (profile) {
      await supabase.from("village_profile").update({
        population_total: 4826,
        family_total: 1392,
        rt_total: 24,
        rw_total: 8,
        area_size: "425 Ha",
        updated_at: new Date().toISOString()
      }).eq("id", profile.id);
    }

    // Delete all demographics
    await supabase.from("demographics").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    
    // Insert defaults
    await supabase.from("demographics").insert([
      { type: "gender", label: "Laki-laki", value: 2431, sort_order: 1 },
      { type: "gender", label: "Perempuan", value: 2395, sort_order: 2 }
    ]);
    
    await supabase.from("demographics").insert([
      { type: "education", label: "Tidak Sekolah", value: 266, sort_order: 1 },
      { type: "education", label: "SD/Sederajat", value: 1520, sort_order: 2 },
      { type: "education", label: "SMP/Sederajat", value: 1240, sort_order: 3 },
      { type: "education", label: "SMA/Sederajat", value: 1410, sort_order: 4 },
      { type: "education", label: "Diploma (D1-D4)", value: 180, sort_order: 5 },
      { type: "education", label: "Sarjana (S1-S3)", value: 210, sort_order: 6 }
    ]);

    await supabase.from("demographics").insert([
      { type: "job", label: "Petani / Kebun", value: 1650, sort_order: 1 },
      { type: "job", label: "Karyawan Swasta", value: 1220, sort_order: 2 },
      { type: "job", label: "Wiraswasta / UMKM", value: 880, sort_order: 3 },
      { type: "job", label: "PNS / TNI / POLRI", value: 120, sort_order: 4 },
      { type: "job", label: "Pelajar / Mahasiswa", value: 730, sort_order: 5 },
      { type: "job", label: "Belum / Tidak Bekerja", value: 226, sort_order: 6 }
    ]);

    await supabase.from("demographics").insert([
      { type: "age_group", label: "0 - 5 tahun", value: 390, sort_order: 1 },
      { type: "age_group", label: "6 - 12 tahun", value: 530, sort_order: 2 },
      { type: "age_group", label: "13 - 18 tahun", value: 480, sort_order: 3 },
      { type: "age_group", label: "19 - 35 tahun", value: 1450, sort_order: 4 },
      { type: "age_group", label: "36 - 50 tahun", value: 1190, sort_order: 5 },
      { type: "age_group", label: "51 - 65 tahun", value: 610, sort_order: 6 },
      { type: "age_group", label: "66+ tahun", value: 176, sort_order: 7 }
    ]);

    await supabase.from("demographics").insert([
      { type: "religion", label: "Islam", value: 4792, sort_order: 1 },
      { type: "religion", label: "Kristen Protestan", value: 24, sort_order: 2 },
      { type: "religion", label: "Katolik", value: 10, sort_order: 3 },
      { type: "religion", label: "Hindu", value: 0, sort_order: 4 },
      { type: "religion", label: "Buddha", value: 0, sort_order: 5 },
      { type: "religion", label: "Konghucu", value: 0, sort_order: 6 }
    ]);
  } catch (e) {
    console.error(e);
  }
}

