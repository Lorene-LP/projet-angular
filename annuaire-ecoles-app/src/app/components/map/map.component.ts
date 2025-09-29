import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { School } from '../../models/school.model';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Icon, Style } from 'ol/style';
import Overlay from 'ol/Overlay';


@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() schools: School[] = [];
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('popup', { static: false }) popupRef!: ElementRef<HTMLDivElement>;
  @ViewChild('sideDetail', { static: false }) sideDetailRef!: ElementRef<HTMLDivElement>;
  private map?: Map;
  private vectorLayer?: VectorLayer<any>;
  private overlay?: Overlay;
  selectedSchool: School | null = null;

  constructor(private router: Router) {}

  ngAfterViewInit() {
    // Délai plus long pour assurer que le DOM est complètement rendu
    setTimeout(() => {
      console.log('ngAfterViewInit - Tentative d\'initialisation de la carte');
      this.initMap();
    }, 500);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.map && changes['schools']) {
      this.addMarkers();
    }
  }

  private initMap() {
    console.log('Initialisation de la carte...');
    console.log('MapContainer:', this.mapContainer?.nativeElement);
    
    if (!this.mapContainer?.nativeElement) {
      console.error('MapContainer non trouvé !');
      return;
    }

    try {
      this.map = new Map({
        target: this.mapContainer.nativeElement,
        layers: [
          new TileLayer({
            source: new OSM()
          })
        ],
        view: new View({
          center: fromLonLat([4.85, 45.75]),
          zoom: 12
        })
      });

      console.log('Carte créée avec succès');

      // Masquer le message de chargement
      const loadingDiv = this.mapContainer.nativeElement.querySelector('div');
      if (loadingDiv) {
        loadingDiv.style.display = 'none';
      }

      // Overlay pour le popup de survol
      if (this.popupRef?.nativeElement) {
        this.overlay = new Overlay({
          element: this.popupRef.nativeElement,
          positioning: 'bottom-center',
          stopEvent: false,
          offset: [0, -20]
        });
        this.map.addOverlay(this.overlay);
      }

      this.addMarkers();
      this.addMapEvents();
      
      // Forcer le redimensionnement après un délai
      setTimeout(() => {
        if (this.map) {
          this.map.updateSize();
          console.log('Carte redimensionnée');
        }
      }, 200);
      
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de la carte:', error);
    }
  }

  private addMarkers() {
    if (!this.map) return;

    // Supprime les anciens marqueurs
    if (this.vectorLayer) {
      this.map.removeLayer(this.vectorLayer);
    }

    const features = this.schools
      .filter(s => s.longitude && s.latitude)
      .map(s => {
        const feature = new Feature({
          geometry: new Point(fromLonLat([s.longitude!, s.latitude!])),
          school: s
        });
        feature.setStyle(new Style({
          image: new Icon({
            src: 'https://openlayers.org/en/latest/examples/data/icon.png',
            anchor: [0.5, 1],
            scale: 0.7
          })
        }));
        return feature;
      });

    const vectorSource = new VectorSource({ features });
    this.vectorLayer = new VectorLayer({ source: vectorSource });
    this.map.addLayer(this.vectorLayer);
  }

  private addMapEvents() {
    if (!this.map) return;

    // Survol d'un marqueur
    this.map.on('pointermove', evt => {
      if (this.map!.hasFeatureAtPixel(evt.pixel)) {
        const feature = this.map!.getFeaturesAtPixel(evt.pixel)[0];
        const school = feature.get('school') as School;
        const statutText = school.statut && school.statut.trim() !== '' ? `${school.statut} - ` : '';
        this.popupRef.nativeElement.innerHTML = `
          <div>
            <strong>${school.nom_etablissement}</strong><br>
            ${school.commune} (${school.code_postal})<br>
            ${statutText}${school.type_etablissement}
          </div>
        `;
        this.overlay!.setPosition(evt.coordinate);
        this.popupRef.nativeElement.style.display = 'block';
      } else {
        this.popupRef.nativeElement.style.display = 'none';
      }
    });

    // Clic sur un marqueur
    this.map.on('singleclick', evt => {
      const features = this.map!.getFeaturesAtPixel(evt.pixel);
      if (features.length > 0) {
        const feature = features[0];
        const school = feature.get('school') as School;
        this.selectedSchool = school;

        // Zoom sur le marqueur
        this.map!.getView().animate({
          center: fromLonLat([school.longitude!, school.latitude!]),
          zoom: 17,
          duration: 500
        });

        // Affiche le panneau latéral
        setTimeout(() => {
          this.sideDetailRef.nativeElement.style.display = 'block';
        }, 300);
      } else {
        this.selectedSchool = null;
        this.sideDetailRef.nativeElement.style.display = 'none';
      }
    });
  }

  closeDetail() {
  this.selectedSchool = null;
  // Dézoom sur Lyon
  this.map?.getView().animate({
    center: fromLonLat([4.85, 45.75]),
    zoom: 12,
    duration: 500
  });
}

  // Méthode pour rediriger vers la page de contact
  contactSchool(id: string) {
    this.router.navigate(['/contact', id]);
  }

  // Redimensionner la carte quand la fenêtre change de taille
  @HostListener('window:resize')
  onResize() {
    if (this.map) {
      setTimeout(() => {
        this.map!.updateSize();
      }, 100);
    }
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.setTarget(undefined);
    }
  }
}