"use client";
import DashboardContent from "@/components/content-dashboard";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/auth-provider";
import CarouselHeader from "./carousel-header";
import LearningProgress from "./learning-progress";
import CarouselCourses from "./carousel-courses";
import CarouselApplications from "./carousel-applications";
import MemberTitle from "./member-title";
import MemberData from "./member-data";

const DashboardComponent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  // Use useEffect para establecer el estado de carga cuando se verifique el estado de autenticación

  useEffect(() => {
    if (isAuthenticated !== null) {
      // Verifica si ya se sabe el estado de la autenticación
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  if (isLoading) {
    // Puedes mostrar un loader o un mensaje mientras esperas la autenticación
    return <div>Loading...</div>;
  }
  return (
    <DashboardContent>
      <CarouselHeader />
      {isAuthenticated && <LearningProgress />}
      <CarouselCourses />
      <CarouselApplications />
      <MemberTitle />
      <MemberData />
    </DashboardContent>
  );
};

export default DashboardComponent;
