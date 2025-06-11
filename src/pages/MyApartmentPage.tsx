import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Apartment, MeterReading } from '@/types';
import { Home, Layers, Square, Building2, Gauge, Calendar } from 'lucide-react';

export function MyApartmentPage() {
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [meterReadings, setMeterReadings] = useState<MeterReading[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadApartmentData();
  }, []);

  const loadApartmentData = async () => {
    try {
      // For demo purposes, using apartment ID 1
      const apartmentId = '1';
      
      const [apartmentData, readingsData] = await Promise.all([
        apiService.getApartment(apartmentId),
        apiService.getMeterReadings(apartmentId),
      ]);

      setApartment(apartmentData);
      setMeterReadings(readingsData);
    } catch (error) {
      toast({
        title: 'Eroare',
        description: 'Nu s-au putut încărca datele apartamentului.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 animate-pulse rounded" />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-48 bg-gray-200 animate-pulse rounded" />
          <div className="h-48 bg-gray-200 animate-pulse rounded" />
        </div>
      </div>
    );
  }

  if (!apartment) {
    return (
      <div className="text-center py-12">
        <Home className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Nu aveți apartament alocat</h3>
        <p className="mt-1 text-sm text-gray-500">
          Contactați administratorul pentru a vă aloca un apartament.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Apartamentul Meu</h1>
        <p className="text-gray-600 mt-1">
          Informații despre apartamentul dvs. și citirile contorilor
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Apartment Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Home className="mr-2 h-5 w-5 text-blue-600" />
              Detalii Apartament
            </CardTitle>
            <CardDescription>
              Informațiile principale despre apartamentul dvs.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Numărul apartamentului</span>
              <Badge variant="default" className="text-lg px-3 py-1">
                {apartment.number}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Blocul</span>
              <div className="flex items-center space-x-2">
                <Building2 className="h-4 w-4 text-gray-400" />
                <span className="font-medium">{apartment.blockName}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Etajul</span>
              <div className="flex items-center space-x-2">
                <Layers className="h-4 w-4 text-gray-400" />
                <span className="font-medium">Etajul {apartment.floor}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Suprafața</span>
              <div className="flex items-center space-x-2">
                <Square className="h-4 w-4 text-gray-400" />
                <span className="font-medium">{apartment.area} mp</span>
              </div>
            </div>

            {apartment.ownerName && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Proprietar</span>
                <span className="font-medium">{apartment.ownerName}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Meter Readings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Gauge className="mr-2 h-5 w-5 text-green-600" />
              Citiri Contoare Recente
            </CardTitle>
            <CardDescription>
              Ultimele citiri ale contorilor dvs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {meterReadings.length > 0 ? (
              <div className="space-y-4">
                {meterReadings.slice(0, 3).map((reading) => (
                  <div key={reading.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">
                        {reading.meterType === 'WATER' ? 'Apă' : 
                         reading.meterType === 'GAS' ? 'Gaz' : 'Electricitate'}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(reading.readingDate).toLocaleDateString('ro-RO')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{reading.currentReading}</div>
                      {reading.consumption && (
                        <div className="text-sm text-green-600">
                          Consum: {reading.consumption}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Gauge className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">
                  Nu există citiri înregistrate
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}