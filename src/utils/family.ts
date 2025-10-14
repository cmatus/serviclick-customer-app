import {
  Home,
  Dog,
  Car,
  Bike,
  Activity,
  HandCoins,
  Medal,
  Hospital,
  Scale,
  ShieldPlus,
  GraduationCap,
  Handshake,
} from "lucide-react";

export const getFamilyIcon = (familyId: string) => {
  switch (familyId) {
    case "cb3a3554-e9d1-4a98-834b-84f61b32b71a": // Hogar
      return Home;
    case "25be82ac-9d67-4c85-bcc1-771981ec11b7": // Bicicletas
      return Bike;
    case "0829a6d1-62ed-49b8-9f9b-c5103fe15514": // Donación
      return HandCoins;
    case "01080197-1a30-4e10-aa5b-f8d6054fc4d6": // Salud
      return Activity;
    case "076842c6-34b6-421c-8ec7-00e25375b9e2": // Membresía
      return Medal;
    case "23642663-111b-4a44-80ef-046dbb4f9301": // Vehículo
      return Car;
    case "f103caf7-e196-4b40-8274-51878c670357": // Veterinaria
      return Dog;
    case "44f9b4ed-e323-4f0d-a2f0-e48e0359419a": // Funeraria
      return Hospital;
    case "b5defa43-f94f-4d77-883a-bd01a3767e7d": // Legal
      return Scale;
    case "3433f178-cda4-4486-b99d-1a404b6451cd": // Dental
      return ShieldPlus;
    case "004889c8-4860-40e6-a8e0-cb491d16b010": // Test
      return Handshake;
    case "290a790c-f7e3-491f-b528-c218401e5fe0": // Escolar
      return GraduationCap;
    case "52257aa7-4a97-4d02-a08a-7d2324f49630": // Salud + Dental
      return Handshake;
    case "1e7e708d-5ced-4272-82b4-eeb538daecf2": // Seguro + Asistencia
      return Handshake;
  }
};
