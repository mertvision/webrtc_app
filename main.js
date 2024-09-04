/**
 * Statement: In Development 
 * An early-stage test of a WebRTC application that is still under development.
 * Author: Mert Özdemir <mertozdemircontact@icloud.com>
 */

/* WebRTC bağlantısı

Aşağıdaki kodlar WebRTC kullanarak video akışını başlatmak için gerekli olan temel adımları gerçekleştirir. Yerel bir video akışı alır, karşı tarafında
video akışını alır ve bağlantı teklifi (offer) oluşturur.

1- yerel video akışını alır
2- karşı video akışını alır
3- bir bağlantı teklifi oluşturur (offer)
*/
console.log("ok");
// yerel video akışını alan bir değişken
let localStream;

// karşı video akışı
let remoteStream;

// peer connection: WebRTC bağlantısını yönetmek için kullanılacak peerConnection ifadesi
let peerConnection;

/* servers sabiti, WebRTC bağlantısında kullanılacak ICE (Interactive Connectivity Establishment) sunucularını tanımlayan bir sabit oluşturur.
ICE sunucuları WebRTC kullanarak iki nokta arasında bağlantı kurmak için IP adreslerini bulur. Firewall ve NAT gibi ağ engellerini aşar.

servers nesnesi içinde iceServers anahtarı bulunur. iceServers bir dizidir. dizi içinde objeler mevcuttur.*/

const servers = {
    iceServers: [
        {
            urls: ['stun:stun1.1.google.com:19302','stun:stun2.1.google.com:19302']
        }
    ]
};

console.log("servers")

/* init() fonksiyonu: async anahtar kelimesiyle asenkron bir işlem gerçekleşecektir. (Promise nesnesi döndüren await anahtar kelimesi) 
tarayıcıdan yerel video akışını alır ve html dökümanında video etiketinin src'ine yerleştirir. */

let init = async () => {
      localStream = await navigator.mediaDevices.getUserMedia({video: true, audio: false});
      document.getElementById("user-1").srcObject = localStream;     

      createOffer()
};

/* SDP Offer

SDP (Session Description Protocol) Offer, bir iletişim oturumu veya medya akışı başlatmak için kullanılan bir protokol mesajıdır. 
SDP, İnternet İletişim Kurumu (IETF) tarafından tanımlanan bir protokoldür ve gerçek zamanlı iletişim uygulamalarında (örneğin, VoIP, 
video konferans, anlık mesajlaşma) kullanılır. SDP, iletişim oturumunun parametrelerini ve özelliklerini tanımlayan metin tabanlı bir 
formattır. Bu parametreler, kullanılan medya türünü (ses, video, veri), ağ bağlantılarını, codec'leri, protokol bilgilerini, ses/video 
özelliklerini ve diğer oturum parametrelerini içerebilir. SDP mesajı, iletişimi başlatmak isteyen taraf tarafından diğer taraflara gönderilir.
SDP Offer, bir iletişim oturumunu başlatmak isteyen tarafın, diğer tarafa oturum parametrelerini içeren bir teklif sunmasıdır. Bu teklif, 
oturumun nasıl kurulacağı ve hangi özelliklere sahip olacağı gibi bilgileri içerir. Alıcı taraf, SDP Offer'ı değerlendirir ve bir yanıt 
olarak SDP Answer'ı gönderir. SDP Answer, teklifi kabul etmek, reddetmek veya teklifi değiştirmek için kullanılır. SDP Offer ve SDP Answer 
mesajları, iletişim tarafındaki oturumun başlatılması ve özelliklerin belirlenmesi için bir müzakere süreci oluştururlar. Bu süreç, 
iletişim tarafındaki uygulamaların birbirlerini anlamalarını ve uyumlu bir iletişim oturumu oluşturmalarını sağlar.

createOffer() fonksiyonu: createOffer() işlevi asenkron bir işlevdir ve WebRTC bağlantısı için bir offer-teklif oluşturur. offer, bir
bağlantı başlatma talebini temsil eder.*/

let createOffer = async () => {
    try{
       // RTCPeerConnection sınıfından yeni bir nesne oluşturur. Bu WebRTC ile bağlantı kurmak için bir peer (eş)'i temsil eder.
    peerConnection = new RTCPeerConnection(servers);
    // Uzaktaki kullanıcının video akışını temsil eder.
    remoteStream = new MediaStream();

    document.getElementById("user-2").srcObject = remoteStream;

    localStream.getTracks().forEach((track)=> {
        peerConnection.addTrack(track, localStream)
    });

    peerConnection.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track)=> {
            remoteStream.addTrack(track)
        })
    }

    peerConnection.onicecandidate = async (event) => {
        if(event.candidate){
            console.log("New ICE Candidate:", event.candidate)
        }    
    }

    let offer = peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    }
    catch(err){
        console.log("Err:", err);
    }
    
}